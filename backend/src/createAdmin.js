require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "JobNest Owner";
  if (!email || !password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env before running npm run create-admin");
  await connectDB();
  const hash = await bcrypt.hash(password, 12);
  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { name, email: email.toLowerCase(), password: hash, role: "ADMIN", isActive: true },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  console.log(`Admin ready: ${user.email}`);
  process.exit(0);
}
main().catch(err => { console.error("Admin creation failed:", err.message); process.exit(1); });
