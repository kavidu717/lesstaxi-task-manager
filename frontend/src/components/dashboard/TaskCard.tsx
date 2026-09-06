"use client";

import { DragEvent } from "react";
import type { Task } from "@/lib/api/tasks";

interface TaskCardProps {
  task: Task;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
}

export default function TaskCard({
  task,
  onDragStart,
  onDragEnd,
}: TaskCardProps) {
  const handleDragStart = (
    event: DragEvent<HTMLElement>
  ) => {
    event.dataTransfer.effectAllowed = "move";

    onDragStart(task._id);
  };

  return (
    <article
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className="cursor-grab rounded-xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md active:cursor-grabbing"
    >
      <h4 className="font-semibold text-gray-900">
        {task.title}
      </h4>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        {task.description}
      </p>

      <div className="mt-4">
        <p className="text-xs text-gray-500">
          Created by
        </p>

        <p className="text-sm font-medium text-gray-700">
          {task.creator?.name ?? "Unknown"}
        </p>
      </div>

      <div className="mt-3">
        <p className="text-xs text-gray-500">
          Assigned to
        </p>

        <p className="text-sm font-medium text-gray-700">
          {task.assignedUser?.name ?? "Unassigned"}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </article>
  );
}