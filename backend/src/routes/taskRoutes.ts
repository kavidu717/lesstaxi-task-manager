import express from 'express'
import { protect } from '../middleware/authMiddleware';
import { createTask, getTasks } from '../controllers/taskController';


const router=express.Router()




router.post("/", protect, createTask);
router.get("/", protect, getTasks);



export default router



