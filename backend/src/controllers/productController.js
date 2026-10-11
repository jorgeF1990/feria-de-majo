import Product from '../models/Product.js';
import { uploadMultipleImages } from '../config/cloudinary.js';

// Cache en memoria para reducir consultas a MongoDB
let productsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 60000; // 60 segundos

const clearCache = () => {
  productsCache = null;
  cacheTimestamp = null;
};

export const getProducts = async (req, res) => {
  try {
    const now = Date.now();
    
    // Usar cache si está disponible y es reciente
    if (productsCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      res.set('Cache-Control', 'public, max-age=60');
      return res.json({
        success: true,
        data: productsCache,
        fromCache: true
      });
    }

    const { categoria, talle, color, estado, destacado, search, limit = 100, page = 1 } = req.query;

    const query = {};

    if (categoria) query.categoria = categoria;
    if (talle) query.talle = talle;
    if (color) query.color = color;
    if (estado) query.estado = estado;
    if (destacado) query.destacado = destacado === 'true';

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    let sort = { orden: 1, createdAt: -1 };
    if (search) {
      sort = { score: { $meta: 'textScore' } };
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .select('-__v')
        .lean()
        .exec(),
      Product.countDocuments(query).exec()
    ]);

    // Guardar en cache solo si no hay filtros
    if (Object.keys(query).length === 0) {
      productsCache = products;
      cacheTimestamp = now;
    }

    res.set('Cache-Control', 'public, max-age=60');
    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los productos',
      error: error.message
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('-__v').lean();
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el producto',
      error: error.message
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    let imagenes = [];
    if (req.files && req.files.length > 0) {
      imagenes = await uploadMultipleImages(req.files, 'feria-de-majo');
    } else if (req.body.imagenes && req.body.imagenes.length > 0) {
      imagenes = req.body.imagenes;
    }

    if (imagenes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere al menos una imagen'
      });
    }

    const productData = {
      ...req.body,
      imagenes,
      nuevo: req.body.nuevo === 'true' || req.body.nuevo === true,
      destacado: req.body.destacado === 'true' || req.body.destacado === true
    };

    const product = new Product(productData);
    await product.save();

    clearCache();

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear el producto',
      error: error.message
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const existingProduct = await Product.findById(productId);
    
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    let imagenes = existingProduct.imagenes;
    if (req.files && req.files.length > 0) {
      const nuevasImagenes = await uploadMultipleImages(req.files, 'feria-de-majo');
      imagenes = [...imagenes, ...nuevasImagenes];
    } else if (req.body.imagenes) {
      imagenes = req.body.imagenes;
    }

    const updateData = {
      ...req.body,
      imagenes,
      nuevo: req.body.nuevo === 'true' || req.body.nuevo === true,
      destacado: req.body.destacado === 'true' || req.body.destacado === true
    };

    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    const product = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    clearCache();

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el producto',
      error: error.message
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    await product.deleteOne();

    clearCache();

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el producto',
      error: error.message
    });
  }
};

export const updateProductStatus = async (req, res) => {
  try {
    const { estado } = req.body;
    const estadosValidos = ['disponible', 'reservado', 'archivado', 'vendido'];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado no válido',
        validStates: estadosValidos
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    clearCache();

    res.json({
      success: true,
      message: `Producto actualizado a: ${estado}`,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el estado',
      error: error.message
    });
  }
};