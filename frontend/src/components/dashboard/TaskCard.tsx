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
      className="cursor-grab rounded-lg border border-gray-200 bg-white p-4 shadow-sm active:cursor-grabbing"
    >
      <h4 className="font-medium text-gray-900">{currentTask.title}</h4>
      <p className="mt-1 text-sm text-gray-500">{currentTask.description}</p>

      <div className="mt-4 flex flex-col gap-2 text-xs text-gray-500">
        <div>
          <span className="block text-gray-400">Created by</span>
          <span className="font-medium text-gray-700">
            {currentTask.creator?.name || "Unknown"}
          </span>
        </div>

        <div>
          <span className="block text-gray-400 mb-1">Assigned to</span>
          {isAdmin ? (
            <select
              value={currentTask.assignedUser?._id || ""}
              onChange={(e) => handleAssign(e.target.value || null)}
              disabled={isAssigning}
              className="w-full rounded border border-gray-300 p-1 text-sm text-gray-700 outline-none focus:border-black"
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
                <span className="font-medium text-gray-700">
                  {currentTask.assignedUser.name}
                </span>
              ) : (
                <button
                  onClick={() => handleAssign(currentUserId as string)}
                  disabled={isAssigning}
                  className="rounded bg-black px-2 py-1 text-white hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {isAssigning ? "Assigning..." : "Assign to me"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {canModify && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onEdit(currentTask)}
            className="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(currentTask._id)}
            className="rounded border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}