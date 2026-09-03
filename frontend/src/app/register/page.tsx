'use client'
import api from "@/lib/axios"
import { useState } from "react"
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { toast } from "sonner";


export default function Register() {

    const router = useRouter()


    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [fieldErrors, setFieldErrors] = useState<{ field: string, message: string }[]>([])
    const [loading, setLoading] = useState(false)


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        setFieldErrors([])

        try {
            const response = await api.post('/auth/register',
                {
                    name
                    , email,
                    password
                }
            )
            if (response.data.status === 'success') {
                toast.success("Registration successful!");

                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        }

        catch (err: unknown) {
            if (err instanceof AxiosError && err.response) {
                const data = err.response.data

                if (data.errors) {
                    setFieldErrors(data.errors);

                } else if (data.message) {
                    toast.error(data.message)
                }

            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }


        }
        finally {
            setLoading(false);
        }




    }
    const getFieldError = (fieldName: string) => {
        return fieldErrors.find((err) => err.field === `body.${fieldName}`)?.message;
    };

    return (
        <div className="min-h-screen flex w-full font-sans bg-white">
            {/* Left side Image */}
            <div className="hidden md:block w-1/2 min-h-screen">
                <img 
                    src="https://res.cloudinary.com/doujmzgn3/image/upload/v1788415709/pexels-jakubzerdzicki-35719566_cpkcys.jpg" 
                    alt="Register Background" 
                    className="object-cover w-full h-full"
                />
            </div>

            {/* Right side Form */}
            <div className="w-full md:w-1/2 p-10 md:p-14 lg:p-24 flex flex-col justify-center bg-white min-h-screen">
                    <h2 className="text-4xl font-bold mb-10 text-gray-900">Register</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Name Field */}
                        <div className="relative">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                FULL NAME
                            </label>
                            <input 
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value)
                                    setFieldErrors([]);
                                }}
                                placeholder="Enter Your Full Name"
                                className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-[#3ba3d0] transition-colors bg-transparent placeholder-gray-300 text-gray-700"
                            />
                            {getFieldError('name') && (
                                <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">{getFieldError('name')}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="relative">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                EMAIL
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setFieldErrors([]);
                                }}
                                placeholder="Enter Your Email"
                                required
                                className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-[#3ba3d0] transition-colors bg-transparent placeholder-gray-300 text-gray-700"
                            />
                            {getFieldError('email') && (
                                <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">{getFieldError('email')}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setFieldErrors([]);
                                }}
                                placeholder="••••••••"
                                required
                                className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-[#3ba3d0] transition-colors bg-transparent placeholder-gray-300 text-gray-700 tracking-widest"
                            />
                            {getFieldError('password') && (
                                <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">{getFieldError('password')}</p>
                            )}
                        </div>

                        {/* Checkbox */}
                        <div className="flex items-center pt-2">
                            <input 
                                type="checkbox" 
                                id="terms" 
                                required 
                                className="w-4 h-4 text-[#3ba3d0] border-gray-300 rounded focus:ring-[#3ba3d0] cursor-pointer" 
                            />
                            <label htmlFor="terms" className="ml-3 text-sm text-gray-400 font-medium cursor-pointer">
                                I agree All the Statements in <a href="#" className="text-[#3ba3d0] hover:underline">terms of service</a>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-[#3ba3d0] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#2e8ab3] transition-colors mt-8 focus:outline-none focus:ring-2 focus:ring-[#3ba3d0] focus:ring-opacity-50"
                        >
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </form>
                </div>
        </div>
    )
}