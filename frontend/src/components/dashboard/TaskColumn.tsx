
"use client";

import { DragEvent } from "react";
import TaskCard from "./TaskCard";
import { Task, TaskStatus } from "./TaskBoard";

interface TaskColumnProps {
  title: TaskStatus;
  tasks: Task[];

  onDragStart: (taskId: string) => void;
  onDrop: (status: TaskStatus) => void;
  onDragEnd: () => void;
}

export default function TaskColumn({
  title,
  tasks,
  onDragStart,
  onDrop,
  onDragEnd,
}: TaskColumnProps) {

  // Allow dropping
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // Drop task
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    onDrop(title);
  };

  return (
    <section className="rounded-xl bg-gray-200 p-4">

      {/* Column Header */}

      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">
          {title}
        </h3>

        <span className="rounded-full bg-white px-3 py-1 text-xs
          font-medium text-gray-600">
          {tasks.length}
        </span>
      </div>

      {/* Drop Zone */}

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="min-h-[400px] space-y-4 rounded-lg transition"
      >
        {tasks.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed
            border-gray-300 p-6 text-center">

            <p className="text-sm text-gray-500">
              Drop tasks here
            </p>

          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>

    </section>
  );
}

