# Módulo de Links — especificação técnica

## Contexto

Especificação para o CRUD de links encurtados. Pressupõe o módulo de autenticação já concluído (`Auth.private` disponível, `req.user` com `{ id, name, email }`).

Rotas envolvidas:
```
GET    /link        — listar links do usuário autenticado
POST   /link         — criar link encurtado
PATCH  /link/:id     — editar link
DELETE /link/:id     — apagar link
GET    /link/:slug   — redirecionar (rota pública, fora do escopo deste documento)
```

---

## 1. Regras de negócio

**RN01 — Posse de recurso**
Todo link pertence a exatamente um usuário (o que o criou). Nenhum usuário pode ler, editar ou apagar um link que não seja seu.

**RN02 — Ocultação de existência**
Quando um usuário tenta acessar (ler/editar/apagar) um link que não existe OU que existe mas não é dele, a API responde da mesma forma nos dois casos: **404**, mesma mensagem. Nunca 403 nesse contexto — 403 revelaria que o recurso existe.

**RN03 — Slug é gerado pelo sistema**
O usuário não escolhe o slug. O sistema gera automaticamente, e o slug deve ser único em toda a tabela de links (não só por usuário).

**RN04 — Colisão de slug é responsabilidade do sistema, não do usuário**
Se o slug gerado já existir (colisão), o sistema deve gerar outro automaticamente, sem expor esse problema ao usuário como erro.

**RN05 — URL de destino precisa ser válida**
O sistema não aceita qualquer string como URL de destino — precisa ser uma URL bem formada (com protocolo, domínio válido na forma).

**RN06 — Expiração é escolhida pelo usuário**
O usuário define a data de expiração ao criar o link. O `CreateLinkSchema` deve validar que essa data é uma data futura (não faz sentido criar um link já expirado).

**RN07 — Link expirado não redireciona**
Quando alguém acessa o slug de um link cuja `expiresAt` já passou, o sistema não deve redirecionar normalmente — precisa ter um comportamento definido (página de erro, 410 Gone, etc). *Fora do escopo deste documento, mas a regra precisa existir antes da rota pública ser implementada.*

**RN08 — Edição de link**
No `PATCH`, o usuário pode alterar a URL de destino e a data de expiração. O slug **não é editável** (continua sendo decisão de imutabilidade do sistema, conforme escopo original do projeto). Não existe campo de título nesta versão do projeto.

**RN09 — Apagar link apaga os clicks (cascade)**
Ao deletar um link, os registros de `Click` associados são apagados automaticamente. Isso precisa ser configurado no `schema.prisma`, na relação entre `Link` e `Click`, com `onDelete: Cascade`.

---

## 2. Tasks (ordem recomendada de implementação)

### Task 1 — Schema de validação (Zod)
Criar `CreateLinkSchema` e `UpdateLinkSchema`. Pensar em RN05, RN06 e RN08 antes de escrever.

### Task 2 — Geração de slug
Função isolada (lib ou util) que gera um slug aleatório. Pensar em RN03 e RN04: tamanho do slug, charset usado, e como verificar colisão antes de persistir.

### Task 3 — Service: createLink
Recebe `userId` + dados validados. Gera slug, garante unicidade, persiste.

### Task 4 — Service: findLinksByUser
Lista apenas os links do `userId` informado — nunca todos os links da tabela.

### Task 5 — Service: findLinkOwnedByUser (helper interno)
Função auxiliar reutilizável: busca um link por `id`, verifica se pertence ao `userId`. Lança `AppError(404)` se não existir ou não pertencer. Essa função vai ser usada tanto por `updateLink` quanto por `deleteLink` — não duplica a lógica de verificação nos dois.

### Task 6 — Service: updateLink
Usa o helper da Task 5, depois aplica as mudanças permitidas (conforme RN08).

### Task 7 — Service: deleteLink
Usa o helper da Task 5, depois remove o link. Resolver RN09 antes (cascade no schema do Prisma, provavelmente).

### Task 8 — Controllers
Um por rota, seguindo o padrão do `authController`: valida com Zod, chama o service, responde.

### Task 9 — Rotas
Registrar no router, todas com `Auth.private`.

---

## 3. Critérios de aceitação técnicos

### CT01 — Criar link (`POST /link`)
- [ ] Exige autenticação
- [ ] Valida a URL de destino com Zod antes de qualquer outra coisa
- [ ] Gera slug automaticamente — usuário não pode enviar um slug próprio (se enviar, é ignorado ou rejeitado, decisão sua, mas precisa ser consistente)
- [ ] Garante unicidade do slug mesmo sob colisão (RN04)
- [ ] Link criado é automaticamente associado ao `userId` do token, nunca a um `userId` vindo do body
- [ ] Resposta de sucesso inclui o link criado, incluindo o slug gerado

### CT02 — Listar links (`GET /link`)
- [ ] Exige autenticação
- [ ] Retorna **apenas** links do usuário autenticado — nunca a tabela inteira
- [ ] Se o usuário não tiver nenhum link, retorna lista vazia (200), não erro

### CT03 — Editar link (`PATCH /link/:id`)
- [ ] Exige autenticação
- [ ] Se o link não existir → 404
- [ ] Se o link existir mas pertencer a outro usuário → 404 (mesma mensagem do caso anterior, RN02)
- [ ] Campos imutáveis (ex: slug, se essa for sua decisão em RN08) são ignorados ou rejeitados se enviados — decisão consistente
- [ ] Validação dos campos editáveis via Zod

### CT04 — Apagar link (`DELETE /link/:id`)
- [ ] Exige autenticação
- [ ] Mesmas regras de 404 do CT03
- [ ] Resolve o destino dos `Click` associados (RN09) sem erro de constraint
- [ ] Resposta de sucesso não precisa devolver corpo — 204 é apropriado aqui (pesquisar por que 204 não tem body)

### CT05 — Reaproveitamento de lógica de autorização
- [ ] A verificação "link existe e pertence ao usuário" está implementada uma única vez (Task 5) e reutilizada — não duplicada entre `update` e `delete`

---

## 4. Decisões de produto (confirmadas)

1. Expiração: escolhida pelo usuário na criação, deve ser data futura
2. Edição: apenas URL de destino e data de expiração são editáveis
3. Deleção: cascade — apagar link remove os clicks associados

---

## 5. Definição de pronto

O módulo de Links está concluído quando:
1. Todos os critérios CT01–CT05 estão marcados
2. Testado manualmente: tentar editar/apagar link de outro usuário (deve dar 404), criar dois links em sequência rápida (checar que não colidem slug), apagar um link que tem clicks associados
3. Nenhuma rota expõe links de outros usuários, em nenhum cenário
