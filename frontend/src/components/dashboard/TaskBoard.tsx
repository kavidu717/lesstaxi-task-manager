"use client";

import TaskColumn from "./TaskColumn";

export type TaskStatus = "To Do" | "Doing" | "Done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  creator: string;
  assignedUser: string | null;
}

const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Create Login Page",
    description: "Build the login UI with email and password fields.",
    status: "To Do",
    creator: "Kavidu",
    assignedUser: null,
  },
  {
    id: "2",
    title: "Create REST API",
    description: "Implement task management REST APIs.",
    status: "To Do",
    creator: "Kavidu",
    assignedUser: "John",
  },
  {
    id: "3",
    title: "Database Setup",
    description: "Configure MongoDB and create task schema.",
    status: "Doing",
    creator: "Kavidu",
    assignedUser: "Kavidu",
  },
  {
    id: "4",
    title: "Authentication",
    description: "Implement JWT authentication and authorization.",
    status: "Doing",
    creator: "John",
    assignedUser: "Kavidu",
  },
  {
    id: "5",
    title: "Project Documentation",
    description: "Write README and setup instructions.",
    status: "Done",
    creator: "Kavidu",
    assignedUser: "Kavidu",
  },
];

export default function TaskBoard() {
  const todoTasks = sampleTasks.filter(
    (task) => task.status === "To Do"
  );

  const doingTasks = sampleTasks.filter(
    (task) => task.status === "Doing"
  );

  const doneTasks = sampleTasks.filter(
    (task) => task.status === "Done"
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">

      {/* Page Header */}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            My Tasks
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage and track your tasks
          </p>
        </div>

        <button
          className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium
          text-white transition hover:bg-gray-800"
        >
          + Create Task
        </button>
      </div>

      {/* Board */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

        <TaskColumn
          title="To Do"
          tasks={todoTasks}
        />

        <TaskColumn
          title="Doing"
          tasks={doingTasks}
        />

        <TaskColumn
          title="Done"
          tasks={doneTasks}
        />

      </div>
    </section>
  );
}