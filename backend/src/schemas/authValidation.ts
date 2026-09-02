import {z} from "zod";

export const registerSchema = z.object({
    body: z.object({
        name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters long")
        .max(50, "Name must be at most 50 characters long"),

        email: z
        .string()
        .trim()
        .email("Invalid email address")
        .toLowerCase(),
        
        password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character'
      ),
    }),
})

export const loginSchema = z.object({
    body: z.object({
        email: z
        .string()
        .trim()
        .email("Invalid email address")
        .toLowerCase(),
        
        password: z
        .string()
        .min(1, "Password is required"),
    }),
})

