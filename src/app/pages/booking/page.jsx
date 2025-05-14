"use client";
import { useActionState } from "react";
import { useState } from "react";
import addAppointment from "@/app/actions/addAppointment";

const testOptions = ["Blood Test", "ECG", "MRI", "Urine Test","X-Ray"];

// const initialState = { success: false, error: null };



export default function BookAppointment() {
  const [state, formAction, ispending] = useActionState(addAppointment, null);
  const [testCount, setTestCount] = useState(1);

  const addTestField = () => setTestCount(prev => prev + 1);
  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 border rounded shadow black">
      <h2 className="text-2xl font-bold mb-4">Book Appointment</h2>

      <form action={formAction}>
        <label className="block mb-2">Username:</label>
        <input name="username" required className={input} />

        <label className="block mb-2 mt-4">Age:</label>
        <input type="number" name="age" required className={input} />

        <label className="block mb-2 mt-4">Email:</label>
        <input type="email" name="email" className={input} />

        <label className="block mb-2 mt-4">Lab Technician:</label>
        <select name="labTechnician" required className={input}>
          <option value="">Select Technician</option>
          <option value="Dr. Meera">Dr. Meera</option>
          <option value="Dr. Rajeev">Dr. Rajeev</option>
          <option value="DR.MRIDANGAM">DR.MRIDANGAM</option>
          <option value="Dr. Arjun">Dr. Arjun</option>
          <option value="Dr. Kavya">Dr. Kavya</option>
        </select>

        {Array.from({ length: testCount }).map((_, index) => (
          <div key={index} className="mt-6 p-4 border rounded">
            <label className="block mb-1">Test Name:</label>
            <select name={`tests[${index}][testName]`} required className={input}>
              <option value="">Select Test</option>
              {testOptions.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>

            <label className="block mt-2">Remarks:</label>
            <input name={`tests[${index}][remarks]`} className={input} />
          </div>
        ))}

        <button
          type="button"
          onClick={addTestField}
          className="mt-4 bg-blue-500 text-white px-4 py-1 rounded"
        >
          + Add Another Test
        </button>

        <button type="submit" className="mt-6 block w-full bg-green-600 text-white py-2 rounded">
          Submit
        </button>
      </form>


      {ispending && <p className="text-blue-600 mt-4">Submitting...</p>}
      
      { state!= null && state.error && <p className="text-red-600 mt-4">Error: {state.error}</p>}
      {state!= null && state.success && <p className="text-green-600 mt-4">Appointment booked!</p>}
  
    </div>
  );
}

const input = `w-full border px-3 py-2 rounded focus:outline-none focus:ring mt-1`;