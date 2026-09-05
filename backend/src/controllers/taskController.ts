import { AuthRequest } from "../middleware/authMiddleware";
import { Response } from "express";
import Task, { TaskStatus } from "../models/Task";
import mongoose from "mongoose";
import User from "../models/User";


const VALID_TASK_STATUSES: TaskStatus[] = [
  "To Do",
  "Doing",
  "Done",
];


export const createTask = async (req:AuthRequest, res: Response) : Promise<void> => {

    try{

        const {title, description} = req.body;

        const creatorId = req.user?._id;

        if(!creatorId){
            res.status(401).json({
                message:"Unauthorized"
            });
            return;
        }

         if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      res.status(400).json({
        status: "fail",
        message: "Title and description are required",
      });
      return;
    }

    const task = await Task.create({
        title:title.trim(),
        description:description.trim(),
        creator:creatorId,
        status:"To Do",
        assignedUser:null
    });

    res.status(201).json({
        status:"success",
        message:"Task created successfully",
        data:task
    });

    }
    catch(error:unknown){
        console.error("Error creating task:", error);
        res.status(500).json({
            status:"fail",
            message:"Internal server error"
        });
    }

}

export const getTasks = async (req:AuthRequest, res: Response) : Promise<void> => {
    try{

        const userId = req.user?._id;
        const role = req.user?.role;

        if(!userId || !role){
            res.status(401).json({
                message:"Unauthorized"
            });
            return;
        }

        let tasks;

        if(role === "admin"){
            tasks = await Task.find().populate("creator", "name email").sort({createdAt:-1});
        }else{
            tasks = await Task.find({$or:[
                {creator:userId}
                ,{assignedUser:userId},
                {assignedUser:null}
            ]}).populate("creator", "name email").sort({createdAt:-1});
        }

        res.status(200).json({
            status:"success",
            results:tasks.length,
            data:tasks
        });

    }catch(error:unknown){
        const message = error instanceof Error ? error.message : "Internal server error";
        console.error("Error fetching tasks:", message);
        res.status(500).json({
            status:"fail",
            message
        });
    }
}

export const updateTaskStatus = async (req:AuthRequest, res: Response) : Promise<void> => {
    try{

        const id = req.params.id;

        const {status} = req.body;
        
        const userId = req.user?._id;
        const role = req.user?.role;

        if(!userId || !role){
            res.status(401).json({
                message:"Unauthorized"
            });
            return;
        }


        if (typeof id !== "string" || !mongoose.Types.   ObjectId.isValid(id)) {
          res.status(400).json({
           status: "fail",
           message: "Invalid task ID",
       });
       return;
}

     if (
      typeof status !== "string" ||
      !VALID_TASK_STATUSES.includes(status as TaskStatus)
    ) {
      res.status(400).json({
        status: "fail",
        message: "Invalid status. Use To Do, Doing, or Done",
      });
      return;
    }
    const task = await Task.findById(id);

    if(!task){
        res.status(404).json({
            status:"fail",
            message:"Task not found"
        });
        return;
    }

     if(role!== "admin" ){

        const isCreator = task.creator.toString() === userId.toString();

        const isAssignedUser = task.assignedUser?.toString() === userId.toString();


        if(!isCreator && !isAssignedUser){
            res.status(403).json({
                status:"fail",
                message:"Access denied"
            });
            return;
        }
     }

     task.status = status as TaskStatus;
     await task.save();

        res.status(200).json({
            status:"success",
            message:"Task status updated successfully",
            data:task
        });

         
}catch(error:unknown){
     console.error("Error updating task status:", error);
     res.status(500).json({
         status:"fail",
         message:"Internal server error"
     });
}
}

export const assignTask = async (req:AuthRequest, res: Response) : Promise<void> => {

    try{

        const id = req.params.id;

        const {assignedUserId} = req.body;
        
        const userId = req.user?._id;
        const role = req.user?.role;

        if(!userId || !role){
            res.status(401).json({
                message:"Unauthorized"
            });
            return;
        }

          // validate task ID

          if (typeof id !== "string" || !mongoose.Types.   ObjectId.isValid(id)) {
          
            res.status(400).json({
                status: "fail",
                message: "Invalid task ID",
            });
            return;
        }

         const task = await Task.findById(id);

            if(!task){
                res.status(404).json({
                    status:"fail",
                    message:"Task not found"
                });
                return;
            }
      
              if (role === "admin") {
      // Admin can unassign a task
      if (assignedUserId === null || assignedUserId === undefined) {
        task.assignedUser = null;
      } else {
        // Validate assigned user ID
        if (
          typeof assignedUserId !== "string" ||
          !mongoose.Types.ObjectId.isValid(assignedUserId)
        ) {
          res.status(400).json({
            status: "fail",
            message: "Invalid assigned user ID",
          });
          return;
        }

        // Check whether user exists
        const assignedUser = await User.findById(assignedUserId);

        if (!assignedUser) {
          res.status(404).json({
            status: "fail",
            message: "Assigned user not found",
          });
          return;
        }

        task.assignedUser = assignedUser._id;
      }
    }
      

     else {
      // User can only assign an unassigned task
      if (task.assignedUser !== null) {
        res.status(403).json({
          status: "fail",
          message: "This task is already assigned to someone",
        });
        return;
      }

      // User can only assign the task to themselves
      if (
        typeof assignedUserId !== "string" ||
        assignedUserId !== userId.toString()
      ) {
        res.status(403).json({
          status: "fail",
          message: "You can only assign an unassigned task to yourself",
        });
        return;
      }

      task.assignedUser = userId;
    }

    await task.save();

     const updatedTask = await Task.findById(id).populate(
      "creator assignedUser",
      "name email"
    );

        res.status(200).json({
            status:"success",
            message:role === "admin" ? 
            "Task assigned successfully" : "Task assigned to yourself successfully",
            data: updatedTask
        });


    }catch(error:unknown){
        console.error("Error assigning task:", error);
        res.status(500).json({
            status:"fail",
            message:"Internal server error"
        });
    }
}

export const deleteTask = async (req:AuthRequest, res: Response) : Promise<void> => {

    try{

        const id = req.params.id;

        const userId = req.user?._id;
        const role = req.user?.role;

        if(!userId || !role){
            res.status(401).json({
                message:"Unauthorized"
            });
            return;
        }

        if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {

            res.status(400).json({
                status: "fail",
                message: "Invalid task ID",
            });
            return;
        }

        const task = await Task.findById(id);

        if(!task){
            res.status(404).json({
                status:"fail",
                message:"Task not found"
            });
            return;
        }

           if (role !== "admin") {
           const isCreator =
             task.creator.toString() === userId.toString();

             if (!isCreator) {
               res.status(403).json({
                status: "fail",
               message: "You are not authorized to delete this task",
           });
         return;
       }
     } 

         await Task.findByIdAndDelete(id);

        res.status(200).json({
            status:"success",
            message:"Task deleted successfully"
        });

    }catch(error:unknown){
        console.error("Error deleting task:", error);
        res.status(500).json({
            status:"fail",
            message:"Internal server error"
        });
    }

}