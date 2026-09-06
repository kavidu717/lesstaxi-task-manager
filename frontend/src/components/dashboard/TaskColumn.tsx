import { Task, TaskUser, TaskStatus } from "@/lib/api/tasks";
import TaskCard from "./TaskCard";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onDragStart: (taskId: string) => void;
  onDrop: (status: TaskStatus) => void;
  onDragEnd: () => void;
  isAdmin?: boolean;
  usersList?: TaskUser[];
  currentUserId?: string;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskColumn({
  title,
  tasks,
  onDragStart,
  onDrop,
  onDragEnd,
  isAdmin,
  usersList,
  currentUserId,
  onDelete,
  onEdit,
}: TaskColumnProps) {
  return (
    <div
      className="flex flex-col rounded-xl bg-gray-100 p-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(title as TaskStatus)}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-medium text-gray-600 shadow-sm">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {tasks.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-sm text-gray-500">No tasks</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              isAdmin={isAdmin}
              usersList={usersList}
              currentUserId={currentUserId}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  );
}