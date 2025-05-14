"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Navbar from "./Navbar";

export default function NavbarWrapper({ children }) {
    const pathname = usePathname();
    const { isAuthenticated } = useAuth();

    // Don't show navbar on the home page, login page, or signup page
    const hideNavbarPaths = ["/", "/pages/Login", "/pages/Signup"];
    const shouldShowNavbar = !hideNavbarPaths.includes(pathname) && isAuthenticated();

    return (
        <>
            {shouldShowNavbar && <Navbar />}
            {children}
        </>
    );
} 