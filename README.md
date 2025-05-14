# Metropolis Laboratory Management System

A comprehensive laboratory management system built with Next.js for efficiently managing patient appointments, test records, and administrative tasks.

## 🔆 Features

- **Admin Authentication**: Secure login and admin management
- **Dashboard**: View and manage today's appointments
- **Appointment Management**: Track patient appointments with test details, technician assignments, and status
- **User-friendly Interface**: Modern UI with responsive design

## 📋 Technical Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js Server Actions (for server-side logic)
- **Database**: MySQL
- **Authentication**: Custom session-based authentication

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm 

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd metropolis
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the root directory:

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=metropolis
   ```

4. Set up the database:

   - Create a MySQL database named `metropolis`
   - Run the SQL script provided in the [Database Setup](#database-setup) section

5. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Access the application at `http://localhost:3000`

## 💾 Database Setup

### Required Tables

Execute the following SQL script to create the necessary tables:

```sql
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS metropolis;
USE metropolis;

-- Admin table for authentication
CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_name VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Insert default admin for initial access
INSERT INTO admin (admin_name, password)
VALUES ('admin', 'admin123');

-- Users/Patients table
CREATE TABLE users ( 
    patient_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    patient_name VARCHAR(20) NOT NULL, 
    age INT, 
    email VARCHAR(100) UNIQUE 
);
 

-- Lab technicians table
CREATE TABLE lab_technician ( 
    lab_technician_id INT AUTO_INCREMENT PRIMARY KEY, 
    tech_name VARCHAR(30) NOT NULL, 
    details JSON
);

-- Test types table
CREATE TABLE test_types (
  test_type_id INT AUTO_INCREMENT PRIMARY KEY,
  test_type    VARCHAR(50) UNIQUE
);

-- Appointments table
CREATE TABLE appointment (
    appointment_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    appointment_date DATE,
    remarks TEXT,
    test_type_id INT,
    lab_technician_id INT,
    patient_id INT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (patient_id) REFERENCES users(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (lab_technician_id) REFERENCES Lab_technician(lab_technician_id) ON DELETE SET NULL,
    FOREIGN KEY (test_type_id) REFERENCES test_types(test_type_id) ON DELETE SET NULL
);

-- Sample test data
INSERT INTO test_types (test_type, description, cost, duration_minutes) VALUES
('Complete Blood Count', 'Basic blood test that checks different components of blood', 500.00, 30),
('Blood Glucose', 'Measures the amount of glucose in blood', 350.00, 20),
('Lipid Profile', 'Measures cholesterol and triglycerides', 800.00, 45),
('Liver Function Test', 'Assesses liver function', 950.00, 60),
('Thyroid Function Test', 'Checks thyroid hormone levels', 1200.00, 45);

-- Sample technician data
INSERT INTO Lab_technician (tech_name, specialization, contact, email) VALUES
('John Doe', 'Hematology', '1234567890', 'john@example.com'),
('Jane Smith', 'Biochemistry', '9876543210', 'jane@example.com'),
('Robert Johnson', 'Microbiology', '5551234567', 'robert@example.com');
```
