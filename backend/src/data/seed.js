import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import { connectDB } from '../config/database.js';

dotenv.config();

const productosEjemplo = [
  {
    nombre: 'Vestido Midaxi de Lino',
    descripcion: 'Vestido confeccionado en lino 100% natural. Corte midaxi con espalda abierta y detalles en macramé.',
    categoria: 'vestidos',
    talle: 'm',
    color: 'tierra',
    material: 'Lino',
    imagenes: ['https://res.cloudinary.com/ejemplo/image/upload/v1/feria-de-majo/vestido-lino-1.jpg'],
    estado: 'disponible',
    nuevo: true,
    comentario: 'Tela fresca y transpirable. Ideal para eventos de día.',
    destacado: true
  },
  {
    nombre: 'Blusa Oversize de Algodón',
    descripcion: 'Blusa holgada en algodón orgánico. Mangas abullonadas y cuello camisero con bordado artesanal.',
    categoria: 'blusas',
    talle: 's',
    color: 'azul',
    material: 'Algodón Orgánico',
    imagenes: ['https://res.cloudinary.com/ejemplo/image/upload/v1/feria-de-majo/blusa-oversize-1.jpg'],
    estado: 'disponible',
    nuevo: false,
    comentario: 'Última unidad disponible.',
    destacado: false
  },
  {
    nombre: 'Pantalón Palazzo de Lino',
    descripcion: 'Pantalón de tiro alto con pierna ancha. Confeccionado en lino italiano con cintura ajustable.',
    categoria: 'pantalones',
    talle: 'l',
    color: 'negro',
    material: 'Lino Italiano',
    imagenes: ['https://res.cloudinary.com/ejemplo/image/upload/v1/feria-de-majo/pantalon-palazzo-1.jpg'],
    estado: 'disponible',
    nuevo: false,
    comentario: 'Cintura ajustable con cordón.',
    destacado: false
  },
  {
    nombre: 'Campera Kimono Tejida',
    descripcion: 'Campera kimono tejida a mano en alpaca. Diseño oversize con mangas caída y botones de madera.',
    categoria: 'camperas',
    talle: 'm',
    color: 'neutro',
    material: 'Alpaca',
    imagenes: ['https://res.cloudinary.com/ejemplo/image/upload/v1/feria-de-majo/campera-kimono-1.jpg'],
    estado: 'disponible',
    nuevo: true,
    comentario: 'Tejido único. Cada prenda es diferente.',
    destacado: true
  },
  {
    nombre: 'Bufanda Tejida en Punto',
    descripcion: 'Bufanda oversize tejida en lana merino. Punto trenzado con flecos y textura suave.',
    categoria: 'accesorios',
    talle: 'unico',
    color: 'rojo',
    material: 'Lana Merino',
    imagenes: ['https://res.cloudinary.com/ejemplo/image/upload/v1/feria-de-majo/bufanda-1.jpg'],
    estado: 'disponible',
    nuevo: false,
    comentario: 'Ideal para regalo. Empaque especial incluido.',
    destacado: false
  },
  {
    nombre: 'Tapado Largo de Lana',
    descripcion: 'Tapado largo confeccionado en lana virgen. Corte recto con cinturón y bolsillos laterales.',
    categoria: 'tapados',
    talle: 'l',
    color: 'tierra',
    material: 'Lana Virgen',
    imagenes: ['https://res.cloudinary.com/ejemplo/image/upload/v1/feria-de-majo/tapado-largo-1.jpg'],
    estado: 'disponible',
    nuevo: true,
    comentario: 'Ideal para invierno. Abrigado y elegante.',
    destacado: true
  },
  {
    nombre: 'Cartera de Cuero Artesanal',
    descripcion: 'Cartera confeccionada en cuero vacuno. Diseño clásico con detalles cosidos a mano y cierre metálico.',
    categoria: 'carteras',
    talle: 'unico',
    color: 'neutro',
    material: 'Cuero Vacuno',
    imagenes: ['https://res.cloudinary.com/ejemplo/image/upload/v1/feria-de-majo/cartera-cuero-1.jpg'],
    estado: 'disponible',
    nuevo: false,
    comentario: 'Artículo único. No hay dos iguales.',
    destacado: false
  },
  {
    nombre: 'Sweater de Alpaca',
    descripcion: 'Sweater tejido en alpaca 100%. Diseño clásico con cuello redondo y mangas largas.',
    categoria: 'sweaters',
    talle: 'm',
    color: 'negro',
    material: 'Alpaca',
    imagenes: ['https://res.cloudinary.com/ejemplo/image/upload/v1/feria-de-majo/sweater-alpaca-1.jpg'],
    estado: 'disponible',
    nuevo: true,
    comentario: 'Tejido suave y abrigado. Perfecto para el frío.',
    destacado: true
  },
  {
    nombre: 'Chaquetilla de Jean',
    descripcion: 'Chaquetilla corta en denim lavado. Diseño clásico con botones metálicos y cuello solapa.',
    categoria: 'chaquetas',
    talle: 's',
    color: 'azul',
    material: 'Denim',
    imagenes: ['https://res.cloudinary.com/ejemplo/image/upload/v1/feria-de-majo/chaquetilla-jean-1.jpg'],
    estado: 'disponible',
    nuevo: false,
    comentario: 'Perfecta para entretiempo. Combina con todo.',
    destacado: false
  },
  {
    nombre: 'Vestido Corto de Seda',
    descripcion: 'Vestido en seda natural con drapeado asimétrico. Corte fluido con cintura marcada.',
    categoria: 'vestidos',
    talle: 'xl',
    color: 'verde',
    material: 'Seda Natural',
    imagenes: ['https://res.cloudinary.com/ejemplo/image/upload/v1/feria-de-majo/vestido-seda-1.jpg'],
    estado: 'disponible',
    nuevo: false,
    comentario: 'Tela delicada. Recomendamos lavado en seco.',
    destacado: false
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    console.log('🗑️ Datos anteriores eliminados');
    const result = await Product.insertMany(productosEjemplo);
    console.log(`✅ ${result.length} productos insertados correctamente`);
    console.log('📋 Categorías disponibles: vestidos, blusas, pantalones, camperas, tapados, carteras, sweaters, chaquetas, accesorios, otros');
    console.log('📅 Feria: 19 y 20 de septiembre de 2026');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
};

seedDatabase();