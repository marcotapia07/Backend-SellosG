import mongoose from "mongoose";

// Variable global para mantener la conexión activa en Vercel
let cachedConnection = null;

export const connectDB = async () => {
  // Si ya estamos conectados, usamos la conexión existente
  if (mongoose.connection.readyState >= 1) {
    console.log("=> Usando conexión existente");
    return mongoose.connection;
  }

  // Si hay una promesa de conexión en curso, la esperamos
  if (cachedConnection) {
    console.log("=> Esperando a que la conexión actual termine...");
    return cachedConnection;
  }

  try {
    console.log("=> Iniciando nueva conexión a MongoDB...");
    
    // Configuraciones clave para evitar el buffering infinito
    cachedConnection = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Máximo 5 segundos para encontrar el servidor
      connectTimeoutMS: 10000,       // Máximo 10 segundos para establecer conexión
      dbName: 'ssellos_g'            // Forzamos el nombre de la base de datos aquí
    });

    const db = await cachedConnection;
    console.log("=> Conexión exitosa a MongoDB");
    return db;

  } catch (error) {
    cachedConnection = null; // Limpiamos la cache si falla para poder reintentar
    console.error("=> Error crítico en connectDB:", error.message);
    throw error;
  }
};