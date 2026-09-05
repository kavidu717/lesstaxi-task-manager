"use client";

import { Task } from "./TaskBoard";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({
  task,
}: TaskCardProps) {
  return (
    <article
      className="cursor-grab rounded-xl bg-white p-4 shadow-sm
      transition hover:-translate-y-1 hover:shadow-md"
    >

      {/* Title */}

      <h4 className="font-semibold text-gray-900">
        {task.title}
      </h4>

      {/* Description */}

      <p className="mt-2 text-sm leading-6 text-gray-600">
        {task.description}
      </p>

      {/* Creator */}

      <div className="mt-4">
        <p className="text-xs text-gray-500">
          Created by
        </p>

        <p className="text-sm font-medium text-gray-700">
          {task.creator}
        </p>
      </div>

      {/* Assigned User */}

      <div className="mt-3">
        <p className="text-xs text-gray-500">
          Assigned to
        </p>

        <p className="text-sm font-medium text-gray-700">
          {task.assignedUser ?? "Unassigned"}
        </p>
      </div>

      {/* Actions */}

      <div className="mt-4 flex gap-2">

        <button
          className="rounded-md border border-gray-300 px-3 py-1.5
          text-xs font-medium text-gray-700 hover:bg-gray-100"
        >
          Edit
        </button>

        <button
          className="rounded-md border border-red-200 px-3 py-1.5
          text-xs font-medium text-red-600 hover:bg-red-50"
        >
          Delete
        </button>

      </div>

    </article>
  );
}