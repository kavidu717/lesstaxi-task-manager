import express from 'express'
import { protect } from '../middleware/authMiddleware';
import { createTask, getTasks, updateTaskStatus } from '../controllers/taskController';


const router=express.Router()




router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.patch("/:id/status", protect, updateTaskStatus);



export default router



