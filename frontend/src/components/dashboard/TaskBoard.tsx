"use client";

import { useEffect, useState } from "react";
import TaskColumn from "./TaskColumn";
import { getTasks, type Task } from "@/lib/api/tasks";



export default function TaskBoard() {
const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTasks();

        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);

        setError("Failed to load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const todoTasks = tasks.filter(
    (task) => task.status === "To Do"
  );

  const doingTasks = tasks.filter(
    (task) => task.status === "Doing"
  );

  const doneTasks = tasks.filter(
    (task) => task.status === "Done"
  );

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-sm text-gray-500">
            Loading tasks...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-sm text-red-600">
            {error}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
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
          type="button"
          className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          + Create Task
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <TaskColumn
          title="To Do"
          tasks={todoTasks}
          onDragStart={() => {}}
          onDrop={() => {}}
          onDragEnd={() => {}}
        />

        <TaskColumn
          title="Doing"
          tasks={doingTasks}
          onDragStart={() => {}}
          onDrop={() => {}}
          onDragEnd={() => {}}
        />

        <TaskColumn
          title="Done"
          tasks={doneTasks}
          onDragStart={() => {}}
          onDrop={() => {}}
          onDragEnd={() => {}}
        />
      </div>
    </section>
  );
}