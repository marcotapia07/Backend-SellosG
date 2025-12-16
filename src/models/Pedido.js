import mongoose from "mongoose";

const pedidoSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
    required: true
  },
  productos: [{
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1
    },
    subtotal: {
      type: Number,
      required: true
    }
  }],
  total: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ["Pendiente", "En proceso", "Entregado", "Cancelado"],
    default: "Pendiente"
  },
  fechaEntrega: {
    type: Date,
    default: null
  }
}, { timestamps: true });

pedidoSchema.index({ cliente: 1, estado: 1 });


export default mongoose.model("Pedido", pedidoSchema);
