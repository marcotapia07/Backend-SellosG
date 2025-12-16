import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"]
  },
  descripcion: {
    type: String,
    default: ""
  },
  categoria: {
    type: String,
    required: [true, "La categoría es obligatoria"]
  },
  precio: {
    type: Number,
    required: [true, "El precio es obligatorio"]
  },
  stock: {
    type: Number,
    required: [true, "El stock es obligatorio"],
    min: [0, "El stock no puede ser negativo"]
  },
  imagenUrl: { 
    type: String, 
    default: "" 
  },

  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: false
  }
}, { timestamps: true });

export default mongoose.model("Producto", productoSchema);

