"use client";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAdmin } from "@/app/actions/adminAuth";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect } from "react";

export default function AdminLogin() {
    const router = useRouter();
    const { login, isAuthenticated } = useAuth();
    const [state, formAction] = useActionState(loginAdmin, {
        success: false,
        message: "",
        admin: null
    });

    // Handle authentication status changes
    useEffect(() => {
        // Redirect to dashboard if already authenticated
        if (isAuthenticated()) {
            router.push("/pages/dashboard");
            return;
        }

        // Redirect after successful login
        if (state.success && state.admin) {
            login(state.admin);
            router.push("/pages/dashboard");
        }
    }, [state, login, router, isAuthenticated]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-green-900">
            <div className="w-full max-w-md">
                <h1 className="text-4xl font-bold mb-6 text-center text-yellow-300">Admin Login</h1>

                <form
                    action={formAction}
                    className="bg-green-800 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 border border-green-700"
                >
                    {state.message && !state.success && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            <p>{state.message}</p>
                        </div>
                    )}

                    <div className="mb-6">
                        <label className="block text-yellow-200 text-sm font-bold mb-2" htmlFor="adminName">
                            Admin Name
                        </label>
                        <input
                            type="text"
                            id="adminName"
                            name="adminName"
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring focus:ring-green-500"
                            placeholder="Enter your admin name"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-yellow-200 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring focus:ring-green-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between mt-8">
                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                        >
                            Sign In
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <Link href="/" className="text-yellow-200 hover:text-yellow-300 transition">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}