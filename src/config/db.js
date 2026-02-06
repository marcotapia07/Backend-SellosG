import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Esto te dirá si la variable llega y si el nombre de la BD está incluido
    console.log("Intentando conectar a:", process.env.MONGO_URI?.split('@')[1]); 
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conexión exitosa");
  } catch (error) {
    console.error("Error detallado:", error);
    throw error;
  }
};
