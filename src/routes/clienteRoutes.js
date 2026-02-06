import express from "express";
import { 
    registrarCliente, 
    obtenerClientes, 
    actualizarCliente,
    eliminarCliente,
    actualizarPerfilCliente,
} from "../controllers/clienteController.js";
import { protegerRuta, soloAdmin, soloCliente } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Ruta pública para el Registro (POST /api/clientes/register)
// Ruta pública para el Registro (POST /api/clientes/register)
router.post("/register", registrarCliente); 

// Ruta protegida: cliente actualiza su propio perfil
router.patch("/me", protegerRuta, soloCliente, actualizarPerfilCliente);

// Ruta protegida para obtener todos los clientes
router.get("/", protegerRuta, obtenerClientes); 

// Rutas CRUD para clientes (solo admin)
router.put("/:id", protegerRuta, soloAdmin, actualizarCliente);
router.delete("/:id", protegerRuta, soloAdmin, eliminarCliente);



export default router;