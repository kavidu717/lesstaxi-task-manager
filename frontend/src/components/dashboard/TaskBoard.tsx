"use client";

import { useEffect, useState } from "react";
import TaskColumn from "./TaskColumn";
import { useAuthStore } from "@/store/useAuthStore";
import {
  getTasks,
  createTask,
  updateTaskStatus,
  getUsers,
  deleteTask,
  updateTask,
  type Task,
  type TaskStatus,
  type TaskUser,
} from "@/lib/api/tasks";

export default function TaskBoard() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [usersList, setUsersList] = useState<TaskUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [updatingTask, setUpdatingTask] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creatingTask, setCreatingTask] = useState(false);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError("");

        const tasksData = await getTasks();
        setTasks(tasksData);

        if (isAdmin) {
          const usersData = await getUsers();
          setUsersList(usersData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchInitialData();
    }
  }, [user, isAdmin]);

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  const handleDrop = async (newStatus: TaskStatus) => {
    if (!draggedTaskId) return;
    const task = tasks.find((t) => t._id === draggedTaskId);
    if (!task || task.status === newStatus) {
      setDraggedTaskId(null);
      return;
    }

    try {
      setUpdatingTask(true);
      setError("");
      const updatedTask = await updateTaskStatus(draggedTaskId, newStatus);
      setTasks((currentTasks) =>
        currentTasks.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    } catch (error) {
      console.error("Error updating task status:", error);
      setError("Failed to update task status. Please try again.");
    } finally {
      setUpdatingTask(false);
      setDraggedTaskId(null);
    }
  };

  const handleCreateTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    try {
      setCreatingTask(true);
      setError("");
      const newTask = await createTask(title.trim(), description.trim());
      setTasks((currentTasks) => [newTask, ...currentTasks]);
      setTitle("");
      setDescription("");
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating task:", error);
      setError("Failed to create task. Please try again.");
    } finally {
      setCreatingTask(false);
    }
  };

  const handleCloseCreateForm = () => {
    if (creatingTask) return;
    setShowCreateForm(false);
    setTitle("");
    setDescription("");
    setError("");
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(taskId);
      setTasks((currentTasks) => currentTasks.filter((t) => t._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task. Please try again.");
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingTask || !editTitle.trim() || !editDescription.trim()) {
      setError("Title and description are required.");
      return;
    }

    try {
      setIsSubmittingEdit(true);
      setError("");
      const updatedTask = await updateTask(
        editingTask._id,
        editTitle.trim(),
        editDescription.trim()
      );
      setTasks((currentTasks) =>
        currentTasks.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task. Please try again.");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const todoTasks = tasks.filter((task) => task.status === "To Do");
  const doingTasks = tasks.filter((task) => task.status === "Doing");
  const doneTasks = tasks.filter((task) => task.status === "Done");

  if (loading || !user) {
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="text-sm font-medium text-gray-500">Loading workspace...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">
            {isAdmin ? "System Overview" : "My Workspace"}
          </h2>
          <p className="mt-2 text-sm font-medium text-gray-500">
            {isAdmin
              ? "Manage and reassign tasks across the system"
              : "Manage and track your tasks"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] hover:shadow-blue-500/40 active:scale-95"
        >
          + Create Task
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center shadow-sm">
          <p className="text-sm font-medium text-red-600">{error}</p>
        </div>
      )}

      {updatingTask && (
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 border border-blue-100 shadow-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600"></span>
            Updating task status...
          </span>
        </div>
      )}

      {showCreateForm && (
        <div className="mb-10 relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xl shadow-gray-200/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Create New Task</h3>
              <p className="mt-1 text-sm font-medium text-gray-500">Add a new task to your board.</p>
            </div>
            <button
              type="button"
              onClick={handleCloseCreateForm}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleCreateTask} className="space-y-5">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-bold text-gray-700">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                disabled={creatingTask}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-bold text-gray-700">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={4}
                disabled={creatingTask}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCloseCreateForm}
                disabled={creatingTask}
                className="w-full sm:w-auto rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creatingTask}
                className="w-full sm:w-auto rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-black hover:shadow-lg transition-all disabled:opacity-50"
              >
                {creatingTask ? "Creating..." : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      )}

      {editingTask && (
        <div className="mb-10 relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xl shadow-gray-200/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Edit Task</h3>
              <p className="mt-1 text-sm font-medium text-gray-500">Update task details.</p>
            </div>
            <button
              type="button"
              onClick={() => setEditingTask(null)}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleEditSubmit} className="space-y-5">
            <div>
              <label htmlFor="editTitle" className="mb-2 block text-sm font-bold text-gray-700">Title</label>
              <input
                id="editTitle"
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                disabled={isSubmittingEdit}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
            <div>
              <label htmlFor="editDescription" className="mb-2 block text-sm font-bold text-gray-700">Description</label>
              <textarea
                id="editDescription"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
                disabled={isSubmittingEdit}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                disabled={isSubmittingEdit}
                className="w-full sm:w-auto rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingEdit}
                className="w-full sm:w-auto rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-black hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isSubmittingEdit ? "Updating..." : "Update Task"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <TaskColumn
          title="To Do"
          tasks={todoTasks}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          isAdmin={isAdmin}
          usersList={usersList}
          currentUserId={user._id}
          onDelete={handleDeleteTask}
          onEdit={handleEditClick}
        />
        <TaskColumn
          title="Doing"
          tasks={doingTasks}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          isAdmin={isAdmin}
          usersList={usersList}
          currentUserId={user._id}
          onDelete={handleDeleteTask}
          onEdit={handleEditClick}
        />
        <TaskColumn
          title="Done"
          tasks={doneTasks}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          isAdmin={isAdmin}
          usersList={usersList}
          currentUserId={user._id}
          onDelete={handleDeleteTask}
          onEdit={handleEditClick}
        />
      </div>

      {isAdmin && usersList.length > 0 && (
        <div className="mt-16">
          <div className="mb-6">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">System Users</h3>
            <p className="mt-2 text-sm font-medium text-gray-500">List of all registered users in the system</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">User ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {usersList.map((systemUser) => (
                  <tr key={systemUser._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-gray-900">{systemUser.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-500">{systemUser.email}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-gray-400 font-mono">{systemUser._id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}