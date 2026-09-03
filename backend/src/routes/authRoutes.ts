import { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController";
import { loginLimiter, registerLimiter, sanitizeData } from "../middleware/securityMiddleware";
import { validate } from "../middleware/validateMiddleware";
import { loginSchema, registerSchema } from "../schemas/authValidation";




 const router = Router();

 router.post("/register",
     registerLimiter,
     sanitizeData,
     validate(registerSchema) ,
     registerUser)



   router.post("/login",
    loginLimiter,
    sanitizeData,
    validate(loginSchema),
    loginUser)







 export default router;