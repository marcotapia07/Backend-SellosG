import Admin from '../models/Admin.js'; 

const DEFAULT_ADMIN_CREDENTIALS = {
    correo: 'administrador@gmail.com',
    password: 'admin123',
    nombre: 'Admin',
    apellido: 'Sistema',
    cedula: '9999999999',
    telefono: '999999999',
    verificado: true,
    rol: 'administrador'
};

export const seedDefaultAdmin = async () => {
    try {

        const adminExists = await Admin.findOne({ 
            correo: DEFAULT_ADMIN_CREDENTIALS.correo 
        });

        if (!adminExists) {
            console.log('Creando administrador por defecto...');

            await Admin.create(DEFAULT_ADMIN_CREDENTIALS);

            console.log('Administrador por defecto creado: administrador@gmail.com / admin123');
        } else {
            console.log('Administrador por defecto ya existe. Omite el seeding.');
        }
    } catch (error) {
        console.error('Error al inicializar el administrador por defecto:', error.message);
    }
};