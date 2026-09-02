import { ZodType, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";



export const validate=(schema: ZodType)=>{
     
    return async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
        try{
            await schema.parseAsync({
                body:req.body,
                query:req.query,
                params:req.params
            })
            next()
        }
        catch(error:unknown){
            if(error instanceof ZodError){
                res.status(400).json({
                    message:"Validation Error",
                    errors:error.issues.map((issue)=>({
                        field:issue.path.join("."),
                        message:issue.message
                    }))
                })
                return;

            }

            console.error("Unexpected error during validation:", error);

            res.status(500).json({
                message:"Internal Server Error"
            })


        }

    }
}