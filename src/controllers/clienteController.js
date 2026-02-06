import Cliente from '../models/Cliente.js';
import { sendVerificationEmail } from '../utils/emailSender.js';
import crypto from 'crypto';

export const registrarCliente = async (req, res) => {
  const { correo, password, nombre } = req.body;

  try {
    // 1. Validar si ya existe
    let existente = await Cliente.findOne({ correo });
    if (existente) {
      return res.status(409).json({ message: 'El correo ya está registrado.' });
    }

    // 2. Generar token de verificación
    const token = crypto.randomBytes(32).toString('hex');
    const expiration = Date.now() + 3600000;

    // 3. Crear cliente con los nuevos campos
    const cliente = new Cliente({
      correo,
      password,
      nombre,
      verificado: false,
      verificacionToken: token,
      verificacionExpira: expiration
    });

    await cliente.save();

    // 4. Enviar correo de verificación
    try {
      await sendVerificationEmail(correo, token, nombre);
      console.log(`[REGISTRO] Usuario creado y correo enviado a ${correo}`);
      
      res.status(201).json({
        message: 'Registro exitoso. Revisa tu correo para verificar tu cuenta.'
      });
    } catch (emailError) {
      console.error('[REGISTRO] Error enviando email:', emailError.message);
      
      if (!process.env.RESEND_API_KEY) {
        await Cliente.findByIdAndDelete(cliente._id);
        return res.status(500).json({ 
          message: 'Error de configuración: RESEND_API_KEY no está definida en el servidor.',
          error: 'Contacta al administrador del sistema.'
        });
      }
    
      if (process.env.NODE_ENV === 'development') {
        const verificationLink = `${process.env.FRONTEND_URL}/verificar-email?token=${token}`;
        return res.status(201).json({
          message: 'Registro exitoso pero el correo no pudo enviarse. Token de verificación incluido.',
          debug: { token, verificationLink }
        });
      }
      
      await Cliente.findByIdAndDelete(cliente._id);
      return res.status(500).json({ 
        message: 'Error al enviar el correo de verificación. Por favor, intenta registrarte nuevamente.'
      });
    }

  } catch (error) {
    console.error("Error en registrarCliente:", error);
    res.status(500).json({ message: "Error al registrar cliente", error: error.message });
  }
};

export const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener clientes", error });
  }
};

export const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, edad } = req.body;

    const actualizado = await Cliente.findByIdAndUpdate(
      id,
      { nombre, correo, edad },
      { new: true }
    ).select('-password');

    if (!actualizado) return res.status(404).json({ msg: 'Cliente no encontrado' });

    res.json({ msg: 'Cliente actualizado', cliente: actualizado });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ msg: 'Error al actualizar cliente', error: error.message });
  }
};

export const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Cliente.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ msg: 'Cliente no encontrado' });
    res.json({ msg: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ msg: 'Error al eliminar cliente', error: error.message });
  }
};

export const actualizarPerfilCliente = async (req, res) => {
  try {
    const clienteId = req.usuario?._id || req.usuario?.id;
    if (!clienteId) return res.status(401).json({ msg: 'No autorizado' });

    const { nombre, correo, password } = req.body;

    const cliente = await Cliente.findById(clienteId);
    if (!cliente) return res.status(404).json({ msg: 'Cliente no encontrado' });

    const emailChanged = correo && correo !== cliente.correo;

    if (emailChanged) {
      const existente = await Cliente.findOne({ correo });
      if (existente && existente._id.toString() !== clienteId.toString()) {
        return res.status(409).json({ msg: 'El correo ya está registrado.' });
      }
      cliente.correo = correo;
      cliente.verificado = false;
      cliente.verificacionToken = crypto.randomBytes(32).toString('hex');
      cliente.verificacionExpira = Date.now() + 3600000; 
    }

    if (nombre) cliente.nombre = nombre;
    if (password) cliente.password = password; 
    await cliente.save();

    if (emailChanged) {
      await sendVerificationEmail(
        cliente.correo,
        cliente.verificacionToken,
        cliente.nombre || 'Usuario'
      );
    }

    return res.json({
      msg: 'Perfil actualizado',
      necesitaVerificar: emailChanged,
      user: {
        id: cliente._id,
        nombre: cliente.nombre,
        correo: cliente.correo,
        rol: cliente.rol,
        verificado: cliente.verificado,
      },
    });
  } catch (error) {
    console.error('Error al actualizar perfil de cliente:', error);
    res.status(500).json({ msg: 'Error al actualizar perfil', error: error.message });
  }
};
