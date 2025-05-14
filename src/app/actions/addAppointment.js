"use server";

import db from "@/app/lib/db";

export default async function addAppointment(state, formData) {
  const data = {
    username: formData.get("username"),
    age: formData.get("age"),
    email: formData.get("email"),
    labTechnician: formData.get("labTechnician"),
    tests: [],
  };

  let index = 0;
  while (true) {
    const testName = formData.get(`tests[${index}][testName]`);
    const remarks = formData.get(`tests[${index}][remarks]`);
    if (!testName) break;

    data.tests.push({
      testName: testName,
      remarks: remarks,
    });

    index++;
  }

  if (
    !data.username ||
    !data.age ||
    !data.email ||
    !data.labTechnician ||
    data.tests.length == 0
  ) {
    return { error: "All fields are required, including at least one test." };
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [existingUsers] = await conn.query(
      "SELECT patient_id FROM users WHERE patient_name = ? AND email = ?",
      [data.username.trim(), data.email.trim()]
    );
    console.log(existingUsers);
    let patientId;
    if (existingUsers.length) {
      patientId = existingUsers[0].patient_id;
    } else {
      const [insertUser] = await conn.execute(
        "INSERT INTO users (patient_name, age, email) VALUES (?, ?, ?)",
        [data.username.trim(), parseInt(data.age), data.email.trim()]
      );
      patientId = insertUser.insertId;
    }

    const [techRows] = await conn.query(
      "SELECT lab_technician_id FROM lab_technician WHERE tech_name = ?",
      [data.labTechnician]
    );

    if (!techRows.length) {
      throw new Error(`Lab Technician "${data.labTechnician}" not found.`);
    }

    const labTechnicianId = techRows[0].lab_technician_id;
    const today = new Date().toISOString().split("T")[0];

    for (const test of data.tests) {
      const [testTypeRows] = await conn.query(
        "SELECT test_type_id FROM test_types WHERE test_type = ?",
        [test.testName]
      );

      if (!testTypeRows.length) {
        throw new Error(`Test "${test.testName}" not found in database.`);
      }

      const testTypeId = testTypeRows[0].test_type_id;

      await conn.execute(
        `INSERT INTO appointment 
        (appointment_date, lab_technician_id, patient_id, remarks, test_type_id) 
        VALUES (?, ?, ?, ?, ?)`,
        [today, labTechnicianId, patientId, test.remarks, testTypeId]
      );
    }

    await conn.commit();
    conn.release();
    return { success: true };
  } catch (error) {
    await conn.rollback();
    conn.release();
    console.error("[Appointment Error]", error.message);
    return { error: error.message || "Failed to book appointment." };
  }
}

// import db  from "@/app/lib/db";
// export default async function addAppointment(state,formData) {

// //   const { username, age, email, labTechnician, tests } = formData;
// //   console.log("Yo bro whsupp");
// //   console.log('Username:',username);
// // console.log('Age:', age);
// // console.log('Email:', email);
// // console.log('Lab Technician:', labTechnician);
// // console.log('Tests:', tests);

// const formEntries = Array.from(formData.entries());

// const data = {
//   username: formData.get("username"),
//   age: formData.get("age"),
//   email: formData.get("email"),
//   labTechnician: formData.get("labTechnician"),
//   tests: []
// };

// // Loop through all form entries
// let index = 0;
// while (true) {
//   const testName = formData.get(`tests[${index}][testName]`);
//   const remarks = formData.get(`tests[${index}][remarks]`);
//   if (!testName) break; // no more entries

//   data.tests.push({
//     test_name: testName,
//     remark: remarks
//   });

//   index++;
// }

// console.log('Final structured form data:', data);

//   if (!data.username || !data.age || !data.email || !data.labTechnician || data.tests.length == 0) {
//     return { error: 'All fields are required, including at least one test.' };
//   }

//   const conn = await db.getConnection();
//   try {
//     await conn.beginTransaction();

//     // SELECT patient_id , name FROM users WHERE patient_name = 'Arush';
//     // will return:
//     // [
//     //   [ { patient_id: 1 , patient_name:"Arush" } ],  // 👈 result rows
//     //   [ ...fields info... ]   // 👈 metadata (not needed here)
//     // ]

//     const [existingUsers] = await conn.query(
//       'SELECT patient_id FROM users WHERE patient_name = ?AND email = ?',
//       [data.username.trim() ,data.email.trim()]
//     );

//     let patientId;
//     if (existingUsers.length) {
//       patientId = existingUsers[0].patient_id;
//     } else {
//       // inserUser is array of json objects

//       // insertUser = [
//       //   {
//       //     affectedRows: 1,   // Number of rows affected
//       //     insertId: 123,     // ID of the newly inserted row
//       //   }
//       // ];
//       const [insertUser] = await conn.execute(
//         'INSERT INTO users (patient_name, age, email) VALUES (?, ?, ?)',
//         [data.username.trim(), parseInt(data.age), data.email.trim()]
//       );
//       patientId = insertUser.insertId;
//     }

//     const [techRows] = await conn.query(
//       'SELECT lab_technician_id FROM lab_technician WHERE tech_name = ?',
//       [labTechnician]
//     );

//     if (!techRows.length) {
//       throw new Error(`Lab Technician "${labTechnician}" not found.`);
//     }

//     const labTechnicianId = techRows[0].lab_technician_id;
//     const today = new Date().toISOString().split('T')[0];

//     // Insert each test
//     for (const test of tests) {
//       const [testTypeRows] = await conn.query(
//         'SELECT test_type_id FROM test_types WHERE test_type = ?',
//         [test.testName]
//       );

//       if (!testTypeRows.length) {
//         throw new Error(`Test "${test.testName}" not found in database.`);
//       }

//       const testTypeId = testTypeRows[0].test_type_id;

//       await conn.execute(
//         `INSERT INTO appointment
//         (appointment_date, lab_technician_id, patient_id, remarks, test_type_id)
//         VALUES (?, ?, ?, ?, ?)`,
//         [today, labTechnicianId, patientId, test.remarks, testTypeId]
//       );
//     }

//     await conn.commit();
//     conn.release();
//     return { success: true };

//   } catch (error) {
//     await conn.rollback();
//     conn.release();
//     console.error('[Appointment Error]', error.message);
//     return { error: error.message || 'Failed to book appointment.' };
//   }
// }
