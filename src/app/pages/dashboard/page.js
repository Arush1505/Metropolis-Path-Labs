"use client";

import { useState, useActionState } from "react";
import fetchTodayAppointments from "@/app/actions/fetchTodayAppointments";
import Navbar from "@/app/components/Navbar";

export default function DashboardPage() {
  const [state, action] = useActionState(fetchTodayAppointments, {});
  const [completedRows, setCompletedRows] = useState(new Set());

  const handleComplete = (id) => {
    setCompletedRows((prev) => new Set(prev).add(id));
    // You can also trigger a server action to update status here
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Today's Appointments</h2>

        <form action={action}>
          <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Load Appointments
          </button>
        </form>

        {state?.appointments?.length > 0 ? (
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-200 text-left text-sm uppercase">
                <th className="py-3 px-6">S.No</th>
                <th className="py-3 px-6">Patient Name</th>
                <th className="py-3 px-6">Today's Appointment</th>
                <th className="py-3 px-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {state.appointments.map((appt, idx) => {
                const isCompleted = completedRows.has(appt.appointment_id);
                return (
                  <tr
                    key={idx}
                    className={`border-b ${
                      isCompleted ? "line-through text-gray-400" : ""
                    }`}
                  >
                    <td className="py-3 px-6">{idx + 1}</td>
                    <td className="py-3 px-6">{appt.patient_name}</td>
                    <td className="py-3 px-6">{appt.test}</td>
                    <td className="py-3 px-6">
                      <button
                        className={`px-4 py-2 rounded ${
                          isCompleted
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                        } text-white`}
                        onClick={() => handleComplete(idx)}
                        disabled={isCompleted}
                        type="button"
                      >
                        Done
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No appointments yet.</p>
        )}
      </div>
    </div>
  );
}
