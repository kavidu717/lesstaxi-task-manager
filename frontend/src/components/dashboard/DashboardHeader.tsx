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
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          {/* Left Side */}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              Task Manager
            </h1>

            <p className="text-sm font-medium text-gray-500 mt-1">
              Welcome back, <span className="text-gray-700">{user.name}</span>
            </p>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">

            {/* User Info */}
            <div className="text-right flex flex-col justify-center">
              <p className="font-bold text-gray-900 leading-tight">
                {user.name}
              </p>

              <p className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block self-end mt-1">
                {isAdmin ? "Administrator" : "Normal User"}
              </p>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors shadow-sm"
            >
              Logout
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}