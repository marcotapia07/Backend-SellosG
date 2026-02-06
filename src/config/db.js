import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("MONGO_URI existe:", !!process.env.MONGO_URI);
    console.log("MONGO_URI inicia con:", process.env.MONGO_URI?.slice(0, 25));

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI no existe en el entorno");
    }

  await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error MongoDB:", error.message);
    throw error;
  }

};
