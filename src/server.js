// src/server.js

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { seedDefaultAdmin } from "./utils/adminSeeder.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // 1. Conectar a MongoDB
    await connectDB();

    // 2. Seeder administrador
    await seedDefaultAdmin();

    // 3. Ruta raíz (healthcheck)
    app.get("/", (req, res) => {
      res.status(200).send("Backend SellosG OK");
    });

    // 4. Levantar servidor
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Error fatal al iniciar la aplicación:", error);
    process.exit(1);
  }
};

startServer();
