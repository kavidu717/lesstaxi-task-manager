"use client";

import { Task } from "./TaskBoard";
import TaskCard from "./TaskCard";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
}

export default function TaskColumn({
  title,
  tasks,
}: TaskColumnProps) {
  return (
    <section className="rounded-xl bg-gray-200 p-4">

      {/* Column Header */}

      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">
          {title}
        </h3>

        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600">
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
            <p className="text-sm text-gray-500">
              No tasks
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
            />
          ))
        )}
      </div>

    </section>
  );
}