"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TaskBoard from "@/components/dashboard/TaskBoard";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <DashboardHeader />
      <TaskBoard />
    </main>
  );
}