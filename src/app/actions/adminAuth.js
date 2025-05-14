"use server";

import mysql from "mysql2/promise";

// Database connection helper
async function getDbConnection() {
  return mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "admin",
    database: process.env.DB_NAME || "metropolis",
  });
}

/**
 * Authenticates an admin user
 */
export async function loginAdmin(prevState, formData) {
  try {
    const adminName = formData.get("adminName");
    const password = formData.get("password");

    // Validate input
    if (!adminName || !password) {
      return {
        success: false,
        message: "Admin name and password are required",
      };
    }

    // Connect to the database
    const connection = await getDbConnection();

    // Query the admin table for credentials
    const [rows] = await connection.execute(
      "SELECT * FROM admin WHERE admin_name = ?",
      [adminName]
    );

    await connection.end();

    // Check if admin exists
    if (rows.length === 0) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    const admin = rows[0];

    // Check if password matches
    if (admin.password !== password) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    // Successful login
    return {
      success: true,
      message: "Login successful",
      admin: {
        id: admin.admin_id,
        name: admin.admin_name,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
}

/**
 * Verifies an existing admin
 */
export async function verifyAdmin(prevState, formData) {
  try {
    const adminName = formData.get("adminName");
    const password = formData.get("password");

    // Validate input
    if (!adminName || !password) {
      return {
        success: false,
        message: "Admin name and password are required",
      };
    }

    // Connect to the database
    const connection = await getDbConnection();

    // Query the admin table for credentials
    const [rows] = await connection.execute(
      "SELECT * FROM admin WHERE admin_name = ?",
      [adminName]
    );

    await connection.end();

    // Check if admin exists and password matches
    if (rows.length === 0 || rows[0].password !== password) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    // Admin verified
    return {
      success: true,
      message: "Admin verified successfully",
      adminId: rows[0].admin_id,
      adminName: rows[0].admin_name,
    };
  } catch (error) {
    console.error("Verification error:", error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
}

/**
 * Registers a new admin after verification
 */
export async function registerAdmin(prevState, formData) {
  try {
    // Extract form data
    const newAdminName = formData.get("newAdminName");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");
    const authAdminName = formData.get("authAdminName");
    const authPassword = formData.get("authPassword");

    // Validate input
    if (
      !newAdminName ||
      !newPassword ||
      !confirmPassword ||
      !authAdminName ||
      !authPassword
    ) {
      return {
        success: false,
        message: "All fields are required",
      };
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return {
        success: false,
        message: "Passwords don't match",
      };
    }

    // Connect to the database
    const connection = await getDbConnection();

    // 1. Verify the authorizing admin first
    const [authRows] = await connection.execute(
      "SELECT * FROM admin WHERE admin_name = ?",
      [authAdminName]
    );

    if (authRows.length === 0 || authRows[0].password !== authPassword) {
      await connection.end();
      return {
        success: false,
        message: "Authorizing admin credentials are invalid",
      };
    }

    // 2. Check if the new admin name already exists
    const [existingAdmins] = await connection.execute(
      "SELECT * FROM admin WHERE admin_name = ?",
      [newAdminName]
    );

    if (existingAdmins.length > 0) {
      await connection.end();
      return {
        success: false,
        message: "Admin name already exists",
      };
    }

    // 3. Insert the new admin
    await connection.execute(
      "INSERT INTO admin (admin_name, password) VALUES (?, ?)",
      [newAdminName, newPassword]
    );

    await connection.end();

    // Registration successful
    return {
      success: true,
      message: "New admin registered successfully",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
}
