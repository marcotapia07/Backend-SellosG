import mongoose from "mongoose";

// Variable global para mantener la conexión en el "warm-up" de Vercel
let isConnected = false;

export const connectDB = async () => {
  // 1. Si ya estamos conectados, salimos rápido
  if (isConnected || mongoose.connection.readyState === 1) {
    console.log("=> MongoDB: Reutilizando conexión");
    return;
  }

  try {
    console.log("=> MongoDB: Intentando nueva conexión...");
    
    // IMPORTANTE: Desactivamos el buffering para que Mongoose no se quede esperando
    // si la conexión falla, lanzará el error de inmediato.
    mongoose.set('bufferCommands', false);

    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // No esperar más de 5s
      dbName: 'ssellos_g',           // Forzamos el nombre aquí por si acaso
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("=> MongoDB: ¡CONECTADO CON ÉXITO!");
  } catch (error) {
    console.error("=> MongoDB: ERROR CRÍTICO DE CONEXIÓN:", error.message);
    throw error; 
  }
};