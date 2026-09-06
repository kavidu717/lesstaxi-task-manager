import api from "../axios";



export type TaskStatus = "To Do" | "Doing" | "Done";

export interface TaskUser {
  _id: string;
  name: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  creator: TaskUser;
  assignedUser: TaskUser | null;
  createdAt: string;
  updatedAt: string;
}
export const getTasks = async()=>{

    const response = await api.get('/tasks');

    return response.data.data;
     
    
}