import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";
import { seedDefaultAdmin } from "../src/utils/adminSeeder.js";

let isSeeded = false;

export default async function handler(req, res) {
  try {
    // 1. Asegurar conexión antes de cualquier otra operación
    await connectDB();

    // 2. Ejecutar Seeder solo una vez por instancia de servidor
    if (!isSeeded) {
      console.log("=> Ejecutando Seeder inicial...");
      await seedDefaultAdmin();
      isSeeded = true;
      console.log("=> Seeder finalizado con éxito");
    }

    // 3. Pasar la petición a Express
    return app(req, res);

  } catch (error) {
    console.error("=> Error en el Handler de Vercel:", error.message);
    return res.status(500).json({ 
      error: "Error de conexión con el servidor de datos",
      details: error.message 
    });
  }
}