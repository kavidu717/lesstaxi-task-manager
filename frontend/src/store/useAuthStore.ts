import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";



interface User {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
}


interface AuthState {
    user: User | null;
    isAuthenticated: boolean;

    setUser: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            setUser: (user) => {
                set({
                    user,
                    isAuthenticated: true,
                });
            },

            logout: () => {
                Cookies.remove("token");

                set({
                    user: null,
                    isAuthenticated: false,
                });
            },
        }),
        {
            name: "auth-storage",
        }
    )
);