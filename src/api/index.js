import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";
import { seedDefaultAdmin } from "../src/utils/adminSeeder.js";

let seeded = false;

export default async function handler(req, res) {
  try {
    // 1. Conectar a la base de datos (con nuestro nuevo db.js)
    await connectDB();

    // 2. Ejecutar Seeder si es necesario
    if (!seeded) {
      console.log("=> Vercel: Verificando Seeder...");
      await seedDefaultAdmin();
      seeded = true;
    }

    // 3. Ejecutar Express
    return app(req, res);

  } catch (error) {
    console.error("=> Error en Handler:", error.message);
    // IMPORTANTE: Responder con JSON claro para que el front no reciba basura
    if (!res.headersSent) {
      return res.status(500).json({ 
        status: "error",
        message: "Error de servidor/base de datos",
        details: error.message 
      });
    }
  }
}