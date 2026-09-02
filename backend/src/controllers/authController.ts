import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import User from '../models/User';
import bcrypt from 'bcrypt';



// genetrate token function
const generateToken = (id: string, role: 'admin' | 'user'): string => {
    const secret = process.env.JWT_SECRET
     
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    return jwt.sign
    ({
         id,
          role },
           secret,
            { expiresIn: '1d' 

            });

}

export const registerUser=async (req:Request,res:Response):Promise<void>=>{
    try{
        const {name,email,password}=req.body;
        
        const normalizedEmail=email.toLowerCase().trim();
           
        // Check if user already exists
        const userExists=await User.findOne({email:normalizedEmail})

        if (userExists) {
            res.
            status(400).
            json({ 
                message: "User already exists" 
            });
            return;
        }

        const salt=await bcrypt.genSalt(10);

        const hashedPassword=await bcrypt.hash(password,salt);

        const user=await User.create({
            name:name.trim(),
            email:normalizedEmail,
            password:hashedPassword,
            role:"user"
        })

        res.status(201).json({
            status: "success",
            message: "User registered successfully",
            data: {
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,

            }
        })

    }catch(error){
        console.error("Error registering user:", error);
        res.
        status(500).
        json({
             message: "Error registering user" 
            });
    }

}

export const loginUser=async (req:Request,res:Response):Promise<void>=>{
    try{

        const {email,password}=req.body;
       
        const normalizedEmail=email.toLowerCase().trim();

        const user=await User.findOne({email:normalizedEmail}).select("+password");

        if(!user || !(await bcrypt.compare(password,user.password))){

            res.
            status(401).
            json({
                message: "Invalid email or password" 
            });
            return;

        }

        const token=generateToken(user.id,user.role);

        res.status(200).json({
            status: "success",
            message: "User logged in successfully",
            data: {
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            }
        })



    }catch(error){
        console.error("Error logging in user:", error);
        res.
        status(500).
        json({
             message: "Error logging in user" 
            });
    }
}


    

