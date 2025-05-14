"use client";
import { useState, useEffect } from "react";
import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { verifyAdmin, registerAdmin } from "@/app/actions/adminAuth";
import { useAuth } from "@/app/context/AuthContext";

export default function AdminSignup() {
    const [step, setStep] = useState(1); // Step 1: Verify existing admin, Step 2: Create new admin
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const { login } = useAuth();

    // State for the verification step
    const [verifyState, verifyAction] = useActionState(verifyAdmin, {
        success: false,
        message: "",
        adminId: null,
        adminName: ""
    });

    // State for the registration step
    const [registerState, registerAction] = useActionState(registerAdmin, {
        success: false,
        message: ""
    });

    // Store verified admin credentials for registration
    const [verifiedAdmin, setVerifiedAdmin] = useState({
        adminName: "",
        adminId: null
    });

    useEffect(() => {
        if (step === 1 && verifyState.success && verifyState.adminId) {
            const passwordInput = document.getElementById("password");
            if (passwordInput) {
                sessionStorage.setItem("authPassword", passwordInput.value);
            }

            setStep(2);
            setVerifiedAdmin({
                adminName: verifyState.adminName,
                adminId: verifyState.adminId
            });
        }
    }, [verifyState.success, verifyState.adminId, step]);
    // Watch for successful registration and handle redirection
    useEffect(() => {
        if (step === 2 && registerState.success) {
            // Create a minimal admin object for authentication
            const newAdminData = {
                id: Date.now(), // temporary ID since we don't know the actual ID from the server
                name: document.getElementById("newAdminName")?.value || "New Admin"
            };

            // Store the admin in auth context
            login(newAdminData);

            // Redirect to dashboard with a slight delay to allow UI to update
            const timer = setTimeout(() => {
                router.push("/pages/dashboard");
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [registerState.success, step, router, login]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-green-900">
            <div className="w-full max-w-md">
                <h1 className="text-4xl font-bold mb-6 text-center text-yellow-300">
                    {step === 1 ? "Admin Verification" : "Create New Admin"}
                </h1>

                {/* Success messages */}
                {((step === 1 && verifyState.success) || (step === 2 && registerState.success)) && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        <p>{step === 1 ? verifyState.message : registerState.message}</p>
                        {step === 2 && registerState.success && (
                            <p className="mt-2">Redirecting to dashboard...</p>
                        )}
                    </div>
                )}

                {/* Error messages */}
                {((step === 1 && verifyState.message && !verifyState.success) ||
                    (step === 2 && registerState.message && !registerState.success)) && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            <p>{step === 1 ? verifyState.message : registerState.message}</p>
                        </div>
                    )}

                {step === 1 ? (
                    <form
                        action={verifyAction}
                        className="bg-green-800 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 border border-green-700"
                    >
                        <p className="text-yellow-200 mb-4">Please verify with existing admin credentials first</p>

                        <div className="mb-6">
                            <label className="block text-yellow-200 text-sm font-bold mb-2" htmlFor="adminName">
                                Admin Name
                            </label>
                            <input
                                type="text"
                                id="adminName"
                                name="adminName"
                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring focus:ring-green-500"
                                placeholder="Existing admin name"
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
                                placeholder="Existing admin password"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between mt-8">
                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                            >
                                Verify Admin
                            </button>
                        </div>
                    </form>
                ) : (
                    <form
                        action={(formData) => {
                            // Add the verified admin credentials to the form data
                            formData.append("authAdminName", verifiedAdmin.adminName);

                            // Get the password from sessionStorage and add it to the form data
                            const authPassword = sessionStorage.getItem("authPassword");
                            if (authPassword) {
                                formData.append("authPassword", authPassword);
                            }

                            // Call the register action
                            return registerAction(formData);
                        }}
                        className="bg-green-800 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 border border-green-700"
                    >
                        <p className="text-yellow-200 mb-4">
                            Creating new admin as: <span className="font-bold">{verifiedAdmin.adminName}</span>
                        </p>

                        <div className="mb-6">
                            <label className="block text-yellow-200 text-sm font-bold mb-2" htmlFor="newAdminName">
                                New Admin Name
                            </label>
                            <input
                                type="text"
                                id="newAdminName"
                                name="newAdminName"
                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring focus:ring-green-500"
                                placeholder="Enter new admin name"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-yellow-200 text-sm font-bold mb-2" htmlFor="newPassword">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring focus:ring-green-500"
                                placeholder="Enter new password"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-yellow-200 text-sm font-bold mb-2" htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring focus:ring-green-500"
                                placeholder="Confirm new password"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between mt-8">
                            <button
                                type="submit"
                                disabled={isPending || registerState.success}
                                className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ${(isPending || registerState.success) ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                {isPending ? "Registering..." : registerState.success ? "Registration Successful" : "Register New Admin"}
                            </button>
                        </div>
                    </form>
                )}

                <div className="text-center">
                    <Link href="/" className="text-yellow-200 hover:text-yellow-300 transition">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}