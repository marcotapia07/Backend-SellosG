import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";
import { seedDefaultAdmin } from "../src/utils/adminSeeder.js";

let ready = false;

export default async function handler(req, res) {
  try {
    if (!ready) {
      await connectDB();
      await seedDefaultAdmin();
      ready = true;
    }

    return app(req, res);
  } catch (error) {
    console.error("Error handler:", error.message);
    res.status(500).json({ message: "Error del servidor" });
  }
}
