"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold text-green-800">Metropolis</h1>

      <Link href="/pages/booking">
        <button className="bg-green-800 hover:bg-green-900 text-white font-bold py-2 px-4 rounded">
          Book Appointment
        </button>
      </Link>

      <div className="space-x-4">
        {/* Home Link */}
        {pathname === "/pages/Home" ? (
          <span className="text-yellow-500 font-semibold cursor-default">
            Home
          </span>
        ) : (
          <Link href="/pages/Home">
            <span className="text-gray-700 hover:text-green-800 cursor-pointer">
              Home
            </span>
          </Link>
        )}

        {/* Dashboard Link */}
        {pathname === "/pages/dashboard" ? (
          <span className="text-yellow-500 font-semibold cursor-default">
            Dashboard
          </span>
        ) : (
          <Link href="/pages/dashboard">
            <span className="text-gray-700 hover:text-green-800 cursor-pointer">
              Dashboard
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
