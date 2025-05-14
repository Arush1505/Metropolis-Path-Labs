"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-green-900 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold text-yellow-300 mb-10">
        Metropolis Laboratory
      </h1>

      <p className="text-white text-xl mb-10">Admin Portal</p>

      <div className="space-y-6 w-64">
        <Link href="/pages/Login" className="w-full block">
          <button className="w-full px-6 py-4 bg-green-700 text-white rounded-lg hover:bg-green-800 transition duration-300 border border-green-600 shadow-lg">
            Existing Admin
          </button>
        </Link>

        <Link href="/pages/Signup" className="w-full block">
          <button className="w-full px-6 py-4 bg-green-700 text-white rounded-lg hover:bg-green-800 transition duration-300 border border-green-600 shadow-lg">
            New Admin
          </button>
        </Link>
      </div>

      <div className="absolute bottom-4 text-yellow-200 text-sm">
        © {new Date().getFullYear()} Metropolis Lab Management System
      </div>
    </div>
  );
}
