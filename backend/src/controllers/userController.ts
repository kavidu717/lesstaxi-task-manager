import { Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";


export const getUsers = async (req: AuthRequest, res: Response) : Promise<void> => {

    try{

        const users = await User.find().select("_id name email role").sort({ createdAt: -1 });

        res.status(200).json({
            status: "success",
            results: users.length,
            data: users
        });



    }catch(error:unknown){
        console.error("Error fetching users:", error);
        res.status(500)
        .json(
            { message: "Internal Server Error"


             });
    }

}