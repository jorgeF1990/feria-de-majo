import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { connectDB } from '../config/database.js';

dotenv.config();

const usuarios = [
  {
    email: 'm.fernandezbianco7@gmail.com',
    password: 'homemacapaz',
    role: 'admin',
    name: 'M. Fernandez Bianco',
    isActive: true
  },
  {
    email: 'pazfernandezbianco@gmail.com',
    password: 'homemacapaz',
    role: 'admin',
    name: 'Paz Fernandez Bianco',
    isActive: true
  }
];

const seedUsers = async () => {
  try {
    await connectDB();
    
    // Eliminar usuarios existentes
    await User.deleteMany({});
    console.log('Usuarios anteriores eliminados');
    
    // Hashear contraseñas MANUALMENTE
    const salt = await bcrypt.genSalt(10);
    const usuariosHasheados = usuarios.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, salt)
    }));
    
    // Insertar usuarios
    const result = await User.insertMany(usuariosHasheados);
    console.log(`${result.length} usuarios creados:`);
    result.forEach(user => {
      console.log(`  - ${user.email} (${user.role}) - Contraseña hasheada: ${user.password.substring(0, 20)}...`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error en seed de usuarios:', error.message);
    process.exit(1);
  }
};

seedUsers();