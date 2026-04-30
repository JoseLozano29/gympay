import { db } from "./db";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  const adminEmail = "admin@gympay.com";
  const adminPassword = "adminpassword"; // Change this in production

  console.log("🌱 Checking for admin user...");

  const user = db
    .query("SELECT * FROM users WHERE email = ?")
    .get(adminEmail) as any;

  if (user) {
    console.log("✅ Admin user already exists.");
    return;
  }

  console.log("✨ Creating admin user...");
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  db.run(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    ["Admin", adminEmail, hashedPassword, "admin"],
  );

  console.log("✅ Admin user created successfully.");
  console.log(`📧 Email: ${adminEmail}`);
  console.log(`🔑 Password: ${adminPassword}`);
}

seedAdmin();
