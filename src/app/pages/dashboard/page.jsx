"use client";
import { useState, useActionState } from "react";
import fetchTodayAppointments from "@/app/actions/fetchTodayAppointments";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { updateAppointmentComplete } from "@/app/actions/updateComplete"; 
export default function DashboardPage() {
  const [state, action] = useActionState(fetchTodayAppointments, {});
  const [completedRows, setCompletedRows] = useState(new Set());
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/pages/Login");
    }
  }, [isAuthenticated, router]);

  const handleComplete = async (id) => {
    try {
      // Call the updateAppointmentComplete function to mark the appointment as completed
      const result = await updateAppointmentComplete(id);

      if (result.success) {
        // If the update is successful, mark the appointment as completed locally
        setCompletedRows((prev) => {
          const updatedSet = new Set(prev);
          updatedSet.add(id);
          return updatedSet;
        });
      } else {
        alert(result.message || 'Something went wrong');
      }
    } catch (error) {
      console.error("Error completing appointment:", error);
      alert("Error completing the appointment. Please try again.");
    }
  };


  return (
    <div className="min-h-screen bg-black">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Today's Appointments</h2>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Logout
          </button>
        </div>

        <form action={action}>
          <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Load Appointments
          </button>
        </form>

        {state?.appointments?.length > 0 ? (
          <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-black text-left text-sm uppercase">
              <th className="py-3 px-6">S.No</th>
              <th className="py-3 px-6">Patient Name</th>
              <th className="py-3 px-6">Test</th>
              <th className="py-3 px-6">Technician</th>
              <th className="py-3 px-6">Remarks</th>
              <th className="py-3 px-6">Action</th>
            </tr>
          </thead>
          <tbody>
            {state.appointments.map((appt, idx) => {
              const isCompleted = completedRows.has(appt.appointment_id);
              return (
                <tr
                  key={appt.appointment_id || idx}
                  className={`border-b ${isCompleted ? "line-through text-gray-400" : "text-yellow-600"}`}
                >
                  <td className="py-3 px-6">{idx + 1}</td>
                  <td className="py-3 px-6">{appt.patient_name}</td>
                  <td className="py-3 px-6">{appt.test}</td>
                  <td className="py-3 px-6">{appt.technician || "Not Assigned"}</td>
                  <td className="py-3 px-6">
                    <div className="max-w-xs truncate" title={appt.remarks}>
                      {appt.remarks || "No remarks"}
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <button
                      className={`px-4 py-2 rounded ${isCompleted
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                      } text-white`}
                      onClick={() => handleComplete(appt.appointment_id || idx)}
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
          </div>
        ) : (
          <p className="text-white">No appointments yet.</p>
        )}
      </div>
    </div>
  );
}
