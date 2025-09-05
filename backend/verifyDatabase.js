// verifyDatabase.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Password123",
  database: process.env.DB_NAME || "whiskerwatch",
};

const testUsers = [
  {
    user_id: 1,
    firstname: "Angelo",
    lastname: "Cabangal",
    contactnumber: "09084853419",
    birthday: "2000-12-01",
    email: "GeloyCabangal10@gmail.com",
    username: "GeloyC",
    role: "regular",
    address: "Pembo, Taguig City",
    password: "Cabangal10",
  },
  {
    user_id: 4,
    firstname: "Keanu",
    lastname: "Reeves",
    contactnumber: "09398059318",
    birthday: "1964-08-02",
    email: "keanureeves@gmail.com",
    username: "JohnWick",
    role: "head_volunteer",
    address: "Hollywood Hills home",
    password: "johnwick",
  },
  {
    user_id: 5,
    firstname: "Mister",
    lastname: "Bean",
    contactnumber: "09123456789",
    birthday: "1950-12-12",
    email: "MrBean@gmail.com",
    username: "MrBean",
    role: "admin",
    address: "America",
    password: "misterbean",
  },
];

const testDonations = [
  {
    user_id: 1,
    donationType: "Food",
    dateSubmitted: "2025-05-15",
    status: "Pending",
  },
  {
    user_id: 4,
    donationType: "Items",
    dateSubmitted: "2025-05-14",
    status: "Pending",
  },
  {
    user_id: 5,
    donationType: "Products",
    dateSubmitted: "2025-05-14",
    status: "Pending",
  },
];

async function verifyDatabase() {
  let db;
  try {
    db = await mysql.createConnection(dbConfig);
    console.log("Connected to MySQL database!");

    // Users
    const [users] = await db.query("SELECT COUNT(*) AS count FROM users");
    if (users[0].count === 0) {
      console.log("Users table is empty. Inserting test data...");
      for (const user of testUsers) {
        await db.query(
          `INSERT INTO users (user_id, firstname, lastname, contactnumber, birthday, email, username, role, address, password)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            user.user_id,
            user.firstname,
            user.lastname,
            user.contactnumber,
            user.birthday,
            user.email,
            user.username,
            user.role,
            user.address,
            user.password,
          ]
        );
        console.log(`Inserted user: ${user.email}`);
      }
    } else {
      console.log(`Users table has ${users[0].count} records.`);
    }

    // Donations
    const [donations] = await db.query(
      "SELECT COUNT(*) AS count FROM InKindDonation"
    );
    if (donations[0].count === 0) {
      console.log("InKindDonation table is empty. Inserting test data...");
      for (const donation of testDonations) {
        await db.query(
          `INSERT INTO InKindDonation (user_id, donationType, dateSubmitted, status)
           VALUES (?, ?, ?, ?)`,
          [
            donation.user_id,
            donation.donationType,
            donation.dateSubmitted,
            donation.status,
          ]
        );
        console.log(`Inserted donation for user_id: ${donation.user_id}`);
      }
    } else {
      console.log(`InKindDonation table has ${donations[0].count} records.`);
    }

    // Update ENUM
    await db.query(
      `ALTER TABLE InKindDonation MODIFY donationType ENUM('Food','Toys','Litter','Bedding','Other','Items','Products')`
    );
    console.log("Updated donationType ENUM.");

    console.log("Database verification complete.");
  } catch (err) {
    console.error("Error verifying database:", err);
  } finally {
    if (db) await db.end();
    console.log("Database connection closed.");
  }
}

verifyDatabase();
