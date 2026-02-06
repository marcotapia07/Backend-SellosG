import express from "express";
import {
  crearProducto,
  obtenerProductos,
  obtenerProductosAgrupados,
  obtenerProductosPorCategoria,
  buscarProductos,
  actualizarProducto,
  eliminarProducto,
  crearCategoria,
  obtenerCategorias,
  actualizarCategoria,
  eliminarCategoria
} from "../controllers/productoController.js";
import { protegerRuta, soloAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/categorias", obtenerCategorias); 
router.post("/categorias", protegerRuta, soloAdmin, crearCategoria);
router.put("/categorias/:id", protegerRuta, soloAdmin, actualizarCategoria);
router.delete("/categorias/:id", protegerRuta, soloAdmin, eliminarCategoria);

// Público
router.get("/", obtenerProductos);
router.get("/agrupados", obtenerProductosAgrupados); 
router.get("/categoria/:categoriaId", obtenerProductosPorCategoria);
router.get("/buscar/:termino", buscarProductos);

// Admin 
router.post("/", protegerRuta, soloAdmin, crearProducto);
router.put("/:id", protegerRuta, soloAdmin, actualizarProducto);
router.delete("/:id", protegerRuta, soloAdmin, eliminarProducto);

export default router;
