import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";
import { seedDefaultAdmin } from "../src/utils/adminSeeder.js";

let seeded = false;

export default async function handler(req, res) {
  try {
    // 1. Conectar a la DB primero
    await connectDB();

    // 2. Ejecutar Seeder una sola vez
    if (!seeded) {
      console.log("=> [Vercel] Ejecutando verificación de administrador...");
      await seedDefaultAdmin();
      seeded = true;
    }

    // 3. Pasar el control a Express
    return app(req, res);

  } catch (error) {
    console.error("=> [Vercel] Error en la ejecución:", error.message);
    
    // Responder con JSON limpio para el frontend
    if (!res.headersSent) {
      return res.status(500).json({ 
        error: "Database Connection Error",
        message: error.message 
      });
    }
  }
}