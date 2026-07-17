import rateLimit from "express-rate-limit";

export const limit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100, 
    message: "Muitas solicitações, tente novamente mais tarde."
});



export const loginLimiter = rateLimit ({ 
  windowMs : 5 * 60 * 1000 , // 5 minutos 
  max : 5 , // limite de 5 tentativas 
  message : 'Muitas tentativas de login. Tente novamente em 5 minutos.'
 }); 