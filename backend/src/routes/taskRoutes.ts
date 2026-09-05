import express from 'express'
import { protect } from '../middleware/authMiddleware';
import { assignTask, createTask, deleteTask, getTasks, updateTaskStatus } from '../controllers/taskController';


const router=express.Router()




router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.patch("/:id/status", protect, updateTaskStatus);
router.patch("/:id/assign", protect, assignTask);
router.delete("/:id", protect, deleteTask);



export default router



