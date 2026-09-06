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

export const updateTaskStatus = async (
  taskId: string,
  status: TaskStatus
): Promise<Task> => {
  const response = await api.patch(
    `/tasks/${taskId}/status`,
    { status }
  );

  return response.data.data;
};

export const createTask = async (
  title: string,
  description: string
): Promise<Task> => {
  const response = await api.post("/tasks", {
    title,
    description,
  });

  return response.data.data;
};

export const getUsers = async (): Promise<TaskUser[]> => {
  const response = await api.get("/users");
  return response.data.data;
};

export const assignTask = async (
  taskId: string,
  assignedUserId: string | null
): Promise<Task> => {
  const response = await api.patch(`/tasks/${taskId}/assign`, {
    assignedUserId,
  });
  return response.data.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await api.delete(`/tasks/${taskId}`);
};


export const updateTask = async (
  taskId: string,
  title: string,
  description: string
): Promise<Task> => {
  const response = await api.patch(`/tasks/${taskId}`, {
    title,
    description,
  });
  return response.data.data;
};