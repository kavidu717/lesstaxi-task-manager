"use client";

export default function DashboardHeader() {
  const user = {
    name: "Kavidu Dushmantha",
    email: "kavidu@example.com",
    role: "admin",
  };

  const isAdmin = user.role === "admin";

  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Task Manager
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user.name}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {user.name}
            </p>

            <p className="text-xs text-gray-500">
              {isAdmin ? "Administrator" : "Normal User"}
            </p>
          </div>

          <button
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium
            text-gray-700 transition hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}