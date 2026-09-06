"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardHeader() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">

          {/* Left Side */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Task Manager
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Welcome back, {user.name}
            </p>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {/* User Info */}
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {user.name}
              </p>

              <p className="text-sm text-gray-500">
                {isAdmin ? "Administrator" : "Normal User"}
              </p>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
            >
              Logout
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}