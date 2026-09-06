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
      className="flex flex-col rounded-2xl bg-gray-50/80 p-4 sm:p-5 border border-gray-100 shadow-inner min-h-[400px]"
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(title as TaskStatus)}
    >
      <div className="mb-5 flex items-center justify-between border-b border-gray-200/60 pb-3">
        <h3 className="font-bold text-gray-800 tracking-tight">{title}</h3>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-gray-700 shadow-sm ring-1 ring-gray-200">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {tasks.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50">
            <p className="text-sm font-medium text-gray-400">No tasks</p>
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