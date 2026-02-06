import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";
import { seedDefaultAdmin } from "../src/utils/adminSeeder.js";

let ready = false;

export default async function handler(req, res) {
  try {
    console.log("Handler ejecutado");

    if (!ready) {
      console.log("Conectando a Mongo...");
      await connectDB();
      await seedDefaultAdmin();
      ready = true;
      console.log("Mongo conectado y seed listo");
    }

    return app(req, res);
  } catch (error) {
    console.error("Error en handler:", error.message);
    res.status(500).json({ message: "Error del servidor" });
  }
}
