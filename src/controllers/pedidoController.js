import Pedido from "../models/Pedido.js";
import Producto from "../models/Producto.js";

// Crear pedido
export const crearPedido = async (req, res) => {
  try {
    const { cliente, productos } = req.body;

    let total = 0;

    for (const item of productos) {
        const producto = await Producto.findById(item.producto);
        if (!producto || producto.stock < item.cantidad) {
        return res.status(400).json({ message: `Stock insuficiente en ${producto?.nombre}` });
        }
    }

    // Si todo está disponible, restar el stock
    for (const item of productos) {
        const producto = await Producto.findById(item.producto);
        producto.stock -= item.cantidad;
        await producto.save();
        total += producto.precio * item.cantidad;
    }


    const nuevoPedido = new Pedido({ cliente, productos, total });
    await nuevoPedido.save();

    res.status(201).json({ message: "Pedido registrado exitosamente", pedido: nuevoPedido });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los pedidos
export const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate("cliente", "nombre correo")
      .populate("productos.producto", "nombre precio")
      .sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Filtrar pedidos por fecha o estado
export const filtrarPedidos = async (req, res) => {
  try {
    const { estado, desde, hasta } = req.query;
    const filtro = {};

    if (estado) filtro.estado = estado;
    if (desde && hasta) filtro.createdAt = { $gte: new Date(desde), $lte: new Date(hasta) };

    const pedidos = await Pedido.find(filtro)
      .populate("cliente", "nombre correo")
      .populate("productos.producto", "nombre precio");

    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar estado de pedido
export const actualizarPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
    res.json({ message: "Pedido actualizado correctamente", pedido });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar pedido
export const eliminarPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndDelete(req.params.id);
    if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
    res.json({ message: "Pedido eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
