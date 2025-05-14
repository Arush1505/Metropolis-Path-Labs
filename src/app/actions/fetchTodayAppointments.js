"use server";
import mysql from "mysql2/promise";
// Create a connection pool (reuse across requests)
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "admin", // Match the password in next.config.mjs
  database: process.env.DB_NAME || "metropolis",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default async function fetchTodayAppointments(prevState) {
  try {
    console.log("DB Config:", {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      database: process.env.DB_NAME || "metropolis",
    });

    // Get today's date in YYYY-MM-DD format for database comparison
    const today = new Date().toISOString().split("T")[0];
    console.log("Fetching appointments for date:", today);

    // First, check if there are any appointments at all
    const [allAppointments] = await pool.execute(
      `SELECT COUNT(*) as count FROM appointment WHERE completed = 0`
    );
    console.log("Total incomplete appointments in system:", allAppointments[0].count);

    // Now get today's incomplete appointments
    const [rows] = await pool.execute(
      `SELECT 
         a.appointment_id, 
         u.patient_name, 
         t.test_type AS test,
         lt.tech_name AS technician,
         a.remarks
       FROM appointment a
       JOIN users u ON a.patient_id = u.patient_id
       JOIN test_types t ON a.test_type_id = t.test_type_id
       LEFT JOIN Lab_technician lt ON a.lab_technician_id = lt.lab_technician_id
       WHERE DATE(a.appointment_date) = ? AND a.completed = 0`,
      [today]
    );

    console.log("Found incomplete appointments for today:", rows.length);

    // If no appointments are found for today, get the next upcoming incomplete appointment as reference
    if (rows.length == 0) {
      const [upcoming] = await pool.execute(
        `SELECT 
           a.appointment_id, 
           u.patient_name, 
           t.test_type AS test, 
           lt.tech_name AS technician,
           a.remarks,
           a.appointment_date
         FROM appointment a
         JOIN users u ON a.patient_id = u.patient_id
         JOIN test_types t ON a.test_type_id = t.test_type_id
         LEFT JOIN Lab_technician lt ON a.lab_technician_id = lt.lab_technician_id
         WHERE a.appointment_date >= CURDATE() AND a.completed = 0
         ORDER BY a.appointment_date ASC
         LIMIT 1`
      );

      if (upcoming.length > 0) {
        console.log("Next upcoming incomplete appointment:", upcoming[0]);
      }
    }

    return {
      appointments: rows,
      success: true,
      todayDate: today,
      totalAppointments: allAppointments[0].count,
    };
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return {
      appointments: [],
      success: false,
      error: error.message,
      errorCode: error.code,
      sqlState: error.sqlState,
    };
  }
}