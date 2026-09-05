"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

interface FieldError {
    field: string;
    message: string;
}

export default function LoginPage() {
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);

    // States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
    const [loading, setLoading] = useState(false);

    const getFieldError = (field: string) => {
        return fieldErrors.find(
            (error) =>
                error.field === field ||
                error.field === `body.${field}`
        )?.message;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        setFieldErrors([]);

        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            const data = response.data;

            if (data.status === "success") {
                const userData = data.data;

                Cookies.set("token", userData.token, {
                    expires: 1,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                });

                setUser({
                    _id: userData._id,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role,
                });

                toast.success("Login successful!");

                router.push("/dashboard");
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;
                const data = err.response?.data;

                if (data?.errors) {
                    setFieldErrors(data.errors);
                } else if (status === 429) {
                    toast.error("Too many login attempts. Please try again later.");
                } else if (status === 401) {
                    toast.error(data?.message);
                } else if (data?.message) {
                    toast.error(data.message);
                } else if (err.request) {
                    toast.error("Unable to connect to the server. Please try again.");
                } else {
                    toast.error("Something went wrong. Please try again.");
                }
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full font-sans bg-white">
            {/* Left side Image */}
            <div className="hidden md:block w-1/2 min-h-screen">
                <img 
                    src="https://res.cloudinary.com/doujmzgn3/image/upload/v1788415709/pexels-jakubzerdzicki-35719566_cpkcys.jpg" 
                    alt="Login Background" 
                    className="object-cover w-full h-full"
                />
            </div>

            {/* Right side Form */}
            <div className="w-full md:w-1/2 p-10 md:p-14 lg:p-24 flex flex-col justify-center bg-white min-h-screen">
                <div>
                    <h2 className="text-4xl font-bold mb-2 text-gray-900">Login</h2>
                    <p className="text-gray-500 mb-10">Login to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Email Field */}
                    <div className="relative">
                        <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            autoComplete="email"
                            disabled={loading}
                            className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-[#3ba3d0] transition-colors bg-transparent placeholder-gray-300 text-gray-700"
                        />
                        {getFieldError("email") && (
                            <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">{getFieldError("email")}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                        <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            disabled={loading}
                            className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-[#3ba3d0] transition-colors bg-transparent placeholder-gray-300 text-gray-700 tracking-widest"
                        />
                        {getFieldError("password") && (
                            <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">{getFieldError("password")}</p>
                        )}
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-[#3ba3d0] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#2e8ab3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3ba3d0] focus:ring-opacity-50 disabled:opacity-70"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                    Don t have an account?{" "}
                    <button 
                        type="button" 
                        onClick={() => router.push("/register")}
                        className="text-[#3ba3d0] font-semibold hover:underline focus:outline-none"
                    >
                        Register
                    </button>
                </p>
            </div>
        </div>
    );
}