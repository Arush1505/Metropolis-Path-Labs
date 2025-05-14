// actions/updateComplete.js
"use server";
import mysql from 'mysql2/promise';

// Create a connection pool (reuse across requests)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'metropolis',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function updateAppointmentComplete(id) {
  try {
    const [result] = await pool.execute(
      `UPDATE appointment SET completed = 1 WHERE appointment_id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return { success: false, message: 'Appointment not found' };
    }

    return { success: true, message: 'Appointment marked as completed' };
  } catch (error) {
    console.error('Error updating appointment:', error);
    return { success: false, message: 'Error marking appointment as completed' };
  }
}
