import Producto from "../models/Producto.js";

// Crear producto
export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, categoria, precio, stock, imagen } = req.body;
    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      categoria,
      precio,
      stock,
      imagen,
      creadoPor: req.usuario?.id || null
    });
    await nuevoProducto.save();
    res.status(201).json({ message: "Producto creado exitosamente", producto: nuevoProducto });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los productos (público)
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find().sort({ createdAt: -1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Buscar productos por nombre o categoría
export const buscarProductos = async (req, res) => {
  try {
    const { termino } = req.params;
    const productos = await Producto.find({
      $or: [
        { nombre: { $regex: termino, $options: "i" } },
        { categoria: { $regex: termino, $options: "i" } }
      ]
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un producto específico
export const obtenerProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar producto
export const actualizarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto actualizado", producto });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar producto
export const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
