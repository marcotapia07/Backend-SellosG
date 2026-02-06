import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import adminRoutes from "./routes/adminRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";
import pedidoRoutes from "./routes/pedidoRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";
import empleadoRoutes from "./routes/empleadoRoutes.js";
import inventarioRoutes from "./routes/inventarioRoutes.js";
import notificacionRoutes from "./routes/notificacionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://backend-sellos-g.vercel.app/",
  "https://sellos-g-frontend-k62m.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV !== "production") {
  app.use("/uploads", express.static(path.resolve("uploads")));
}

/* rutas */
app.use("/api/admins", adminRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/empleados", empleadoRoutes);
app.use("/api/inventario", inventarioRoutes);
app.use("/api/notificaciones", notificacionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/company", companyRoutes);

/* raíz */
app.get("/", (req, res) => {
  res.send("Backend Sellos-G activo");
});

export default app;
