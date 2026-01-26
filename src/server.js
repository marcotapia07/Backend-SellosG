import app from "./app.js";
import { connectDB } from "./config/db.js";
import { seedDefaultAdmin } from "./utils/adminSeeder.js";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB();
    await seedDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`Servidor local en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar servidor:", error.message);
  }
};

startServer();
