"use client";

import React from "react";
import Image from "next/image";
// import Navbar from "@/app/components/Navbar";
export default function HomePage() {
  const tests = [
    {
      title: "Blood Test",
      image: "/images/blood-test.png",
      description: "Detect infections, anemia, and more with our precise blood testing."
    },
    {
      title: "COVID-19 RT-PCR",
      image: "/images/covid-test.jpg",
      description: "Government-approved RT-PCR testing with fast and accurate results."
    },
    {
      title: "Liver Function Test",
      image: "/images/liver-test.jpeg",
      description: "Assess liver health and detect potential liver-related issues."
    },
    {
      title: "Thyroid Panel",
      image: "/images/thyroid-test.jpeg",
      description: "Check thyroid hormones (T3, T4, TSH) for early detection of imbalance."
    },
    {
      title: "Diabetes Check",
      image: "/images/diabetes-test.jpeg",
      description: "Monitor blood sugar and detect early signs of diabetes."
    },
  ];

  return (
    <div className="bg-green-900 text-white min-h-screen flex flex-col">
      {/* Hero Section */}
      

      <header className="text-center py-12 px-4">
        <h1 className="text-5xl font-bold text-yellow-300 mb-4">Welcome to Metropolis Lab</h1>
        <p className="text-lg max-w-3xl mx-auto text-yellow-100">
          Trusted diagnostic services at your fingertips. Book tests, view reports, and stay ahead of your health with ease.
        </p>
      </header>

      {/* Features */}
      <section className="py-10 bg-green-800">
        <h2 className="text-3xl font-semibold text-center text-yellow-200 mb-8">Features We Offer</h2>
        <div className="flex flex-wrap justify-center gap-6 px-4 max-w-5xl mx-auto">
          {[
            ["Home Sample Collection", "Our professionals visit your home for safe and convenient sample collection."],
            ["Digital Reports", "Access your test results securely anytime, anywhere."],
            ["24/7 Support", "Our team is always ready to assist you with your queries."],
          ].map(([title, desc], i) => (
            <div key={i} className="bg-green-700 rounded-xl shadow-lg p-6 w-72">
              <h3 className="text-xl font-bold text-yellow-300 mb-2">{title}</h3>
              <p className="text-yellow-100 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tests Section */}
      <section className="py-12 bg-green-900 text-center">
        <h2 className="text-3xl font-semibold text-yellow-200 mb-10">Tests We Offer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-6 max-w-7xl mx-auto">
          {tests.map((test, index) => (
            <div key={index} className="bg-green-800 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={test.image}
                alt={test.title}
                width={300}
                height={200}
                className="object-cover w-full h-40"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-yellow-300 mb-1">{test.title}</h3>
                <p className="text-yellow-100 text-sm">{test.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-yellow-200 text-center py-6 mt-auto">
        <p>© {new Date().getFullYear()} Metropolis Lab. All rights reserved.</p>
        <p className="text-sm mt-1">Contact: support@metropolislab.com | +91-1234567890</p>
      </footer>
    </div>
  );
}
