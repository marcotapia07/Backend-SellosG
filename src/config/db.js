import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  // Si ya hay una conexión activa, no intentar conectar de nuevo
  if (isConnected || mongoose.connection.readyState === 1) {
    console.log("=> [MongoDB] Usando conexión existente");
    return;
  }

  try {
    console.log("=> [MongoDB] Intentando nueva conexión...");
    
    // IMPORTANTE: Si no hay conexión, que no guarde comandos en cola (evita el buffering timeout)
    mongoose.set('bufferCommands', false);

    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Máximo 5 segundos para encontrar el clúster
      heartbeatFrequencyMS: 2000,    // Revisar salud de conexión cada 2s
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("=> [MongoDB] Conexión establecida exitosamente");
  } catch (error) {
    console.error("=> [MongoDB] Error de conexión:", error.message);
    throw error; // Lanzar para que el handler lo capture
  }
};