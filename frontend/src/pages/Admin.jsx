import React, { useState, useEffect, useRef } from 'react';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiX, 
  FiSave, 
  FiImage, 
  FiCloud,
  FiLoader,
  FiMenu,
  FiChevronDown
} from 'react-icons/fi';
import { getProducts, createProduct, updateProduct, deleteProduct, updateProductStatus } from '../api/products';
import { uploadMultipleToCloudinary } from '../api/upload';
import { useProducts } from '../hooks/useProducts';

const Admin = () => {
  const { refetch } = useProducts();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: 'vestidos',
    talle: 'm',
    color: 'neutro',
    material: '',
    imagenes: [],
    estado: 'disponible',
    nuevo: false,
    comentario: '',
    destacado: false
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data || []);
    } catch (error) {
      alert('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        categoria: product.categoria || 'vestidos',
        talle: product.talle || 'm',
        color: product.color || 'neutro',
        material: product.material || '',
        imagenes: product.imagenes || [],
        estado: product.estado || 'disponible',
        nuevo: product.nuevo || false,
        comentario: product.comentario || '',
        destacado: product.destacado || false
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nombre: '',
        descripcion: '',
        categoria: 'vestidos',
        talle: 'm',
        color: 'neutro',
        material: '',
        imagenes: [],
        estado: 'disponible',
        nuevo: false,
        comentario: '',
        destacado: false
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const urls = await uploadMultipleToCloudinary(files);
      setFormData(prev => ({
        ...prev,
        imagenes: [...prev.imagenes, ...urls]
      }));
      setUploadProgress(100);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      alert('Error al subir las imágenes. Verifica tu conexión y configuración de Cloudinary.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.imagenes.length === 0) {
      alert('Debes agregar al menos una imagen');
      return;
    }

    try {
      const data = {
        ...formData,
        imagenes: formData.imagenes
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id, data);
        alert('Producto actualizado exitosamente');
      } else {
        await createProduct(data);
        alert('Producto creado exitosamente');
      }
      
      handleCloseModal();
      await refetch();
      await fetchProducts();
      
    } catch (error) {
      alert('Error al guardar el producto');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await deleteProduct(id);
        alert('Producto eliminado');
        await refetch();
        await fetchProducts();
      } catch (error) {
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateProductStatus(id, newStatus);
      await refetch();
      await fetchProducts();
    } catch (error) {
      alert('Error al actualizar el estado');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-text-secondary text-sm sm:text-base">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="container-custom py-4 sm:py-8">
        {/* Header responsive */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-text-primary text-center sm:text-left">
            Panel de Administración
          </h1>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center justify-center gap-2 text-sm sm:text-base py-2 sm:py-2.5 px-4 sm:px-6 w-full sm:w-auto"
          >
            <FiPlus className="text-lg" />
            Nuevo Producto
          </button>
        </div>

        {/* Tabla responsive con scroll horizontal */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          {/* Vista desktop - Tabla */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-light/30">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-light">Producto</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-light">Categoría</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-light">Talle</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-light">Imágenes</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-light">Estado</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-light">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-light/30">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-secondary-light/10 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.imagenes && product.imagenes.length > 0 ? (
                          <img
                            src={product.imagenes[0]}
                            alt={product.nombre}
                            className="w-10 h-10 rounded object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 bg-secondary-light/30 rounded flex items-center justify-center">
                            <FiImage className="text-text-light" />
                          </div>
                        )}
                        <span className="font-medium text-text-primary text-sm">{product.nombre}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-secondary text-sm capitalize">{product.categoria}</td>
                    <td className="px-4 py-3 text-text-secondary text-sm uppercase">{product.talle}</td>
                    <td className="px-4 py-3 text-text-secondary text-sm">
                      <span className="inline-flex items-center gap-1">
                        <FiImage className="text-xs" />
                        {product.imagenes?.length || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={product.estado}
                        onChange={(e) => handleStatusChange(product._id, e.target.value)}
                        className={`text-xs font-semibold px-3 py-1 rounded-full border-0 focus:ring-2 focus:ring-primary ${
                          product.estado === 'disponible' ? 'bg-emerald-50 text-emerald-700' :
                          product.estado === 'reservado' ? 'bg-amber-50 text-amber-700' :
                          'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <option value="disponible">Disponible</option>
                        <option value="reservado">Reservado</option>
                        <option value="archivado">Archivado</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-text-secondary hover:text-primary transition-colors"
                        >
                          <FiEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-text-secondary hover:text-red-600 transition-colors"
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vista mobile - Tarjetas */}
          <div className="md:hidden divide-y divide-secondary-light/30">
            {products.map((product) => (
              <div key={product._id} className="p-4 hover:bg-secondary-light/5 transition-colors">
                <div className="flex items-start gap-3">
                  {product.imagenes && product.imagenes.length > 0 ? (
                    <img
                      src={product.imagenes[0]}
                      alt={product.nombre}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-secondary-light/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiImage className="text-text-light text-2xl" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-text-primary text-sm truncate">{product.nombre}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="text-xs bg-secondary-light/30 text-text-secondary px-2 py-0.5 rounded-full capitalize">{product.categoria}</span>
                      <span className="text-xs bg-secondary-light/30 text-text-secondary px-2 py-0.5 rounded-full uppercase">{product.talle}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <select
                        value={product.estado}
                        onChange={(e) => handleStatusChange(product._id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full border-0 focus:ring-2 focus:ring-primary ${
                          product.estado === 'disponible' ? 'bg-emerald-50 text-emerald-700' :
                          product.estado === 'reservado' ? 'bg-amber-50 text-amber-700' :
                          'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <option value="disponible">Disponible</option>
                        <option value="reservado">Reservado</option>
                        <option value="archivado">Archivado</option>
                      </select>
                      <span className="text-xs text-text-light flex items-center gap-1">
                        <FiImage className="text-xs" />
                        {product.imagenes?.length || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="p-2 text-text-secondary hover:text-primary transition-colors"
                    >
                      <FiEdit className="text-base" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-text-secondary hover:text-red-600 transition-colors"
                    >
                      <FiTrash2 className="text-base" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-secondary">No hay productos</p>
              <button
                onClick={() => handleOpenModal()}
                className="btn-primary mt-4 inline-flex items-center gap-2 text-sm"
              >
                <FiPlus />
                Crear primer producto
              </button>
            </div>
          )}
        </div>

        {/* Modal - Responsive */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-hard">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-text-primary">
                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-secondary-light/30 rounded-full transition-colors"
                  >
                    <FiX className="text-xl text-text-secondary" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 border border-secondary-light/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Descripción *
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full px-3 sm:px-4 py-2 border border-secondary-light/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none text-sm sm:text-base"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        Categoría *
                      </label>
                      <select
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleInputChange}
                        className="w-full px-2 sm:px-4 py-2 border border-secondary-light/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                      >
                        <option value="vestidos">Vestidos</option>
                        <option value="blusas">Blusas</option>
                        <option value="pantalones">Pantalones</option>
                        <option value="camperas">Camperas</option>
                        <option value="tapados">Tapados</option>
                        <option value="carteras">Carteras</option>
                        <option value="sweaters">Sweaters</option>
                        <option value="chaquetas">Chaquetas</option>
                        <option value="accesorios">Accesorios</option>
                        <option value="otros">Otros</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        Talle *
                      </label>
                      <select
                        name="talle"
                        value={formData.talle}
                        onChange={handleInputChange}
                        className="w-full px-2 sm:px-4 py-2 border border-secondary-light/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                      >
                        <option value="s">S</option>
                        <option value="m">M</option>
                        <option value="l">L</option>
                        <option value="xl">XL</option>
                        <option value="unico">Único</option>
                      </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        Color *
                      </label>
                      <select
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="w-full px-2 sm:px-4 py-2 border border-secondary-light/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                      >
                        <option value="neutro">Neutro</option>
                        <option value="tierra">Tierra</option>
                        <option value="azul">Azul</option>
                        <option value="verde">Verde</option>
                        <option value="rojo">Rojo</option>
                        <option value="negro">Negro</option>
                        <option value="otros">Otros</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Material
                    </label>
                    <input
                      type="text"
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      placeholder="Ej: Lino, Algodón, Seda..."
                      className="w-full px-3 sm:px-4 py-2 border border-secondary-light/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Imágenes *
                    </label>
                    
                    <div className="border-2 border-dashed border-secondary-light/50 rounded-lg p-4 sm:p-6 text-center hover:border-primary/50 transition-colors">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={uploading}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`cursor-pointer flex flex-col items-center gap-1 sm:gap-2 ${
                          uploading ? 'opacity-50 pointer-events-none' : ''
                        }`}
                      >
                        <FiCloud className="text-3xl sm:text-4xl text-text-light" />
                        <span className="text-text-secondary font-medium text-sm sm:text-base">
                          {uploading ? 'Subiendo...' : 'Haz clic para subir imágenes'}
                        </span>
                        <span className="text-text-light text-[10px] sm:text-xs">
                          PNG, JPG, WEBP (máx. 5MB cada una)
                        </span>
                      </label>
                    </div>

                    {uploading && (
                      <div className="mt-3">
                        <div className="w-full bg-secondary-light/30 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-text-light mt-1">
                          Subiendo imágenes... {uploadProgress}%
                        </p>
                      </div>
                    )}

                    {formData.imagenes.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {formData.imagenes.map((url, index) => (
                          <div key={index} className="relative group aspect-square">
                            <img
                              src={url}
                              alt={`Imagen ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg border border-secondary-light/30"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                            >
                              <FiX className="text-xs" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-text-light mt-2">
                      {formData.imagenes.length} imagen(es) subidas
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Comentario
                    </label>
                    <input
                      type="text"
                      name="comentario"
                      value={formData.comentario}
                      onChange={handleInputChange}
                      placeholder="Detalle adicional..."
                      className="w-full px-3 sm:px-4 py-2 border border-secondary-light/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm sm:text-base"
                    />
                  </div>

                  <div className="flex flex-wrap gap-4 sm:gap-6">
                    <label className="flex items-center gap-2 text-sm text-text-secondary">
                      <input
                        type="checkbox"
                        name="nuevo"
                        checked={formData.nuevo}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary rounded focus:ring-primary"
                      />
                      Nuevo
                    </label>
                    <label className="flex items-center gap-2 text-sm text-text-secondary">
                      <input
                        type="checkbox"
                        name="destacado"
                        checked={formData.destacado}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary rounded focus:ring-primary"
                      />
                      Destacado
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Estado
                    </label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 border border-secondary-light/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                    >
                      <option value="disponible">Disponible</option>
                      <option value="reservado">Reservado</option>
                      <option value="archivado">Archivado</option>
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-secondary-light/30">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="btn-primary flex items-center justify-center gap-2 w-full sm:flex-1 text-sm sm:text-base py-2 sm:py-2.5 disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <FiLoader className="animate-spin" />
                          Subiendo...
                        </>
                      ) : (
                        <>
                          <FiSave />
                          {editingProduct ? 'Actualizar' : 'Crear'}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="btn-outline w-full sm:w-auto text-sm sm:text-base py-2 sm:py-2.5"
                      disabled={uploading}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;