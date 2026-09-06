import express from 'express'
import { protect, admin } from '../middleware/authMiddleware';
import { getUsers } from '../controllers/userController';



const router=express.Router()


router.get("/", protect, admin, getUsers);


export default router