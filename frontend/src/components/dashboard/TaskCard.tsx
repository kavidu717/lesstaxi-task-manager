import { Task, TaskUser, assignTask } from "@/lib/api/tasks";
import { useState } from "react";
import { toast } from "sonner";

interface TaskCardProps {
  task: Task;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
  isAdmin?: boolean;
  usersList?: TaskUser[];
  currentUserId?: string;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskCard({
  task,
  onDragStart,
  onDragEnd,
  isAdmin,
  usersList,
  currentUserId,
  onDelete,
  onEdit,
}: TaskCardProps) {
  const [isAssigning, setIsAssigning] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task>(task);

  const canModify = isAdmin || currentTask.creator?._id === currentUserId;

  const handleAssign = async (userId: string | null) => {
    try {
      setIsAssigning(true);
      const updatedTask = await assignTask(currentTask._id, userId);
      setCurrentTask(updatedTask);
      toast.success("Task assignment updated!");
    } catch (error) {
      toast.error("Failed to assign task");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div
      draggable
      onDragStart={() => onDragStart(currentTask._id)}
      onDragEnd={onDragEnd}
      className="group cursor-grab rounded-xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all active:cursor-grabbing active:scale-95 relative overflow-hidden"
    >
      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <h4 className="font-semibold text-gray-900 leading-tight">{currentTask.title}</h4>
      <p className="mt-2 text-sm text-gray-500 leading-relaxed">{currentTask.description}</p>

      <div className="mt-5 flex flex-col gap-3 rounded-lg bg-gray-50/50 p-3 text-xs text-gray-500 border border-gray-50">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-400">Created by</span>
          <span className="font-semibold text-gray-700 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">
            {currentTask.creator?.name || "Unknown"}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="font-medium text-gray-400">Assigned to</span>
          {isAdmin ? (
            <select
              value={currentTask.assignedUser?._id || ""}
              onChange={(e) => handleAssign(e.target.value || null)}
              disabled={isAssigning}
              className="w-full rounded-lg border border-gray-200 bg-white p-2 text-sm font-medium text-gray-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
            >
              <option value="">Unassigned</option>
              {usersList?.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          ) : (
            <div>
              {currentTask.assignedUser ? (
                <span className="inline-block font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 shadow-sm">
                  {currentTask.assignedUser.name}
                </span>
              ) : (
                <button
                  onClick={() => handleAssign(currentUserId as string)}
                  disabled={isAssigning}
                  className="w-full rounded-lg bg-gray-900 px-3 py-2 font-medium text-white shadow-sm hover:bg-gray-800 transition-all disabled:opacity-50"
                >
                  {isAssigning ? "Assigning..." : "Assign to me"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {canModify && (
        <div className="mt-4 flex gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onEdit(currentTask)}
            className="flex-1 rounded-lg bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 border border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(currentTask._id)}
            className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 border border-red-100 hover:bg-red-100 hover:border-red-200 transition-all"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}