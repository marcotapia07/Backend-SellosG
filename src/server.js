// src/server.js (MODIFICADO)

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { seedDefaultAdmin } from './utils/adminSeeder.js'; // Importar el seeder

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // 1. Conectar a MongoDB
        // Tienes que modificar connectDB para que devuelva la promesa, o
        // envolver la lógica aquí si connectDB maneja el process.exit(1).
        await connectDB();
        
        // 2. Ejecutar la inicialización del administrador por defecto
        await seedDefaultAdmin();

        // 3. Iniciar el servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
        });

    } catch (error) {
        console.error('❌ Error fatal al iniciar la aplicación:', error.message);
        process.exit(1);
    }
};

// Iniciar el servidor
startServer();