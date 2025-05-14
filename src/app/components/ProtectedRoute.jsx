"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Check authentication only after loading is complete
        if (!loading && !isAuthenticated()) {
            // Redirect to login if not authenticated
            router.push("/pages/Login");
        }
    }, [isAuthenticated, loading, router]);

    // Show nothing while loading or if not authenticated
    if (loading || !isAuthenticated()) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-green-900">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-300 mb-4"></div>
                    <p className="text-yellow-300 text-lg">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // Render children only when authenticated
    return children;
} 