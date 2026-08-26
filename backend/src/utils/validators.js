// Validador para productos
export const validateProduct = (data) => {
  const errors = [];
  const camposRequeridos = ['nombre', 'descripcion', 'precio', 'categoria', 'talle', 'color'];

  // Verificar campos requeridos
  camposRequeridos.forEach(campo => {
    if (!data[campo] || data[campo].trim() === '') {
      errors.push(`El campo "${campo}" es obligatorio`);
    }
  });

  // Validar precio
  if (data.precio && (isNaN(data.precio) || data.precio < 0)) {
    errors.push('El precio debe ser un número positivo');
  }

  // Validar descuento
  if (data.descuento && (isNaN(data.descuento) || data.descuento < 0 || data.descuento > 100)) {
    errors.push('El descuento debe estar entre 0 y 100');
  }

  // Validar categoría
  const categoriasValidas = ['vestidos', 'blusas', 'pantalones', 'camperas', 'accesorios', 'otros'];
  if (data.categoria && !categoriasValidas.includes(data.categoria)) {
    errors.push(`Categoría no válida. Opciones: ${categoriasValidas.join(', ')}`);
  }

  // Validar talle
  const tallesValidos = ['s', 'm', 'l', 'xl', 'unico'];
  if (data.talle && !tallesValidos.includes(data.talle)) {
    errors.push(`Talle no válido. Opciones: ${tallesValidos.join(', ')}`);
  }

  // Validar color
  const coloresValidos = ['neutro', 'tierra', 'azul', 'verde', 'rojo', 'negro', 'otros'];
  if (data.color && !coloresValidos.includes(data.color)) {
    errors.push(`Color no válido. Opciones: ${coloresValidos.join(', ')}`);
  }

  // Validar estado
  const estadosValidos = ['disponible', 'reservado', 'archivado'];
  if (data.estado && !estadosValidos.includes(data.estado)) {
    errors.push(`Estado no válido. Opciones: ${estadosValidos.join(', ')}`);
  }

  // Validar longitud de texto
  if (data.nombre && data.nombre.length > 100) {
    errors.push('El nombre no puede tener más de 100 caracteres');
  }
  if (data.descripcion && data.descripcion.length > 500) {
    errors.push('La descripción no puede tener más de 500 caracteres');
  }
  if (data.comentario && data.comentario.length > 200) {
    errors.push('El comentario no puede tener más de 200 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validador para login
export const validateLogin = (data) => {
  const errors = [];

  if (!data.username || data.username.trim() === '') {
    errors.push('El usuario es obligatorio');
  }

  if (!data.password || data.password.trim() === '') {
    errors.push('La contraseña es obligatoria');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Sanitizar datos
export const sanitizeProduct = (data) => {
  const sanitized = { ...data };
  
  // Eliminar espacios al inicio y final
  if (sanitized.nombre) sanitized.nombre = sanitized.nombre.trim();
  if (sanitized.descripcion) sanitized.descripcion = sanitized.descripcion.trim();
  if (sanitized.comentario) sanitized.comentario = sanitized.comentario.trim();
  
  // Convertir a minúsculas
  if (sanitized.categoria) sanitized.categoria = sanitized.categoria.toLowerCase();
  if (sanitized.talle) sanitized.talle = sanitized.talle.toLowerCase();
  if (sanitized.color) sanitized.color = sanitized.color.toLowerCase();
  if (sanitized.estado) sanitized.estado = sanitized.estado.toLowerCase();
  
  // Convertir a números
  if (sanitized.precio) sanitized.precio = parseFloat(sanitized.precio);
  if (sanitized.precioOriginal) sanitized.precioOriginal = parseFloat(sanitized.precioOriginal);
  if (sanitized.descuento) sanitized.descuento = parseFloat(sanitized.descuento);
  
  // Convertir a booleanos
  if (sanitized.nuevo !== undefined) sanitized.nuevo = Boolean(sanitized.nuevo);
  if (sanitized.destacado !== undefined) sanitized.destacado = Boolean(sanitized.destacado);
  
  return sanitized;
};