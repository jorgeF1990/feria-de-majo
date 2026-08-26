import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [500, 'La descripción no puede tener más de 500 caracteres']
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: {
      values: [
        'vestidos', 
        'blusas', 
        'pantalones', 
        'camperas', 
        'tapados', 
        'carteras',
        'sweaters',
        'chaquetas',
        'accesorios', 
        'otros'
      ],
      message: 'Categoría no válida'
    }
  },
  talle: {
    type: String,
    required: [true, 'El talle es obligatorio'],
    enum: {
      values: ['s', 'm', 'l', 'xl', 'unico'],
      message: 'Talle no válido'
    }
  },
  color: {
    type: String,
    required: [true, 'El color es obligatorio'],
    enum: {
      values: ['neutro', 'tierra', 'azul', 'verde', 'rojo', 'negro', 'otros'],
      message: 'Color no válido'
    }
  },
  material: {
    type: String,
    trim: true
  },
  imagenes: [{
    type: String,
    required: [true, 'Al menos una imagen es obligatoria']
  }],
  estado: {
    type: String,
    enum: {
      values: ['disponible', 'reservado', 'archivado'],
      message: 'Estado no válido'
    },
    default: 'disponible'
  },
  nuevo: {
    type: Boolean,
    default: false
  },
  comentario: {
    type: String,
    trim: true,
    maxlength: [200, 'El comentario no puede tener más de 200 caracteres']
  },
  destacado: {
    type: Boolean,
    default: false
  },
  orden: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

productSchema.index({ nombre: 'text', descripcion: 'text' });
productSchema.index({ categoria: 1, talle: 1, color: 1 });
productSchema.index({ estado: 1 });
productSchema.index({ destacado: -1, orden: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;