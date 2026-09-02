import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";


dotenv.config();



const app:Application = express();
const PORT = process.env.PORT

 app.use(express.json());
 app.use(cors())

 connectDB();

 app.get("/",(req:Request,res:Response)=>{
     
    res.status(200)
    .json(
        {
            message:"lessTaxi Backend is running..."
        }
    )
 })

 app.listen(PORT,
    ()=>
        console.log(`Server is running on port ${PORT}`

    ))