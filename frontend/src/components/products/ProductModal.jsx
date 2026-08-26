import React, { useEffect, useState } from 'react';
import { FiX, FiChevronLeft, FiChevronRight, FiCalendar, FiShare2 } from 'react-icons/fi';
import ShareButtons from '../common/ShareButtons';

const ProductModal = ({ isOpen, onClose, product }) => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentImage(0);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const {
    nombre,
    descripcion,
    categoria,
    talle,
    color,
    material,
    estado,
    imagenes,
    comentario
  } = product;

  const imageList = imagenes?.length > 0 ? imagenes : [];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const getStatusText = () => {
    switch (estado) {
      case 'reservado':
        return 'Reservado';
      case 'archivado':
        return 'Archivado';
      default:
        return 'Disponible';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-hard"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col md:flex-row h-full">
          {/* Imagen - Responsive */}
          <div className="relative md:w-3/5 bg-secondary-light/20">
            <div className="aspect-square md:aspect-auto md:h-[400px] lg:h-[500px] flex items-center justify-center p-2 sm:p-4">
              {imageList.length > 0 ? (
                <img
                  src={imageList[currentImage]}
                  alt={nombre}
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    e.target.src = '';
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center bg-secondary-light/30 text-text-light">
                        <span class="text-4xl sm:text-6xl font-light">${nombre.charAt(0)}</span>
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary-light/30 text-text-light">
                  <span className="text-4xl sm:text-6xl font-light">{nombre.charAt(0)}</span>
                </div>
              )}
            </div>

            {/* Controles del carrusel - Responsive */}
            {imageList.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 sm:p-2.5 rounded-full shadow-medium transition-all hover:scale-105"
                >
                  <FiChevronLeft className="text-base sm:text-xl text-text-secondary" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 sm:p-2.5 rounded-full shadow-medium transition-all hover:scale-105"
                >
                  <FiChevronRight className="text-base sm:text-xl text-text-secondary" />
                </button>
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                  {imageList.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                        idx === currentImage ? 'bg-primary w-3 sm:w-6' : 'bg-white/60 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Badge estado - Responsive */}
            {estado !== 'disponible' && (
              <div className={`absolute top-2 sm:top-4 right-2 sm:right-4 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-semibold uppercase text-[10px] sm:text-sm tracking-wider border border-white/20 backdrop-blur-sm ${
                estado === 'reservado' ? 'bg-amber-600/80' : 'bg-gray-600/80'
              }`}>
                {getStatusText()}
              </div>
            )}
          </div>

          {/* Información - Responsive */}
          <div className="md:w-2/5 p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[40vh] md:max-h-none">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div>
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-text-light">
                  {categoria}
                </span>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-text-primary mt-0.5 sm:mt-1">
                  {nombre}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 hover:bg-secondary-light/30 rounded-full transition-colors flex-shrink-0"
              >
                <FiX className="text-lg sm:text-2xl text-text-secondary" />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {/* Info de la feria - Responsive */}
              <div className="bg-primary/5 rounded-lg p-2.5 sm:p-4 border border-primary/10">
                <div className="flex items-center gap-1.5 sm:gap-2 text-primary">
                  <FiCalendar className="text-sm sm:text-lg" />
                  <span className="font-semibold text-xs sm:text-sm">Feria de Majo</span>
                </div>
                <p className="text-text-secondary text-[10px] sm:text-sm mt-0.5 sm:mt-1">
                  19 y 20 de septiembre · 2026
                </p>
                <p className="text-text-light text-[8px] sm:text-xs mt-0.5 sm:mt-1">
                  Consultá disponibilidad en el stand
                </p>
              </div>

              {/* Descripción */}
              <p className="text-text-secondary text-xs sm:text-sm md:text-base leading-relaxed">
                {descripcion}
              </p>

              {/* Detalles - Responsive */}
              <div className="grid grid-cols-2 gap-1.5 sm:gap-3 py-2 sm:py-3 border-y border-secondary-light/30">
                <div>
                  <span className="text-[8px] sm:text-xs text-text-light uppercase tracking-wider">Talle</span>
                  <p className="font-medium text-xs sm:text-sm uppercase">{talle}</p>
                </div>
                <div>
                  <span className="text-[8px] sm:text-xs text-text-light uppercase tracking-wider">Color</span>
                  <p className="font-medium text-xs sm:text-sm capitalize">{color}</p>
                </div>
                {material && (
                  <div>
                    <span className="text-[8px] sm:text-xs text-text-light uppercase tracking-wider">Material</span>
                    <p className="font-medium text-xs sm:text-sm">{material}</p>
                  </div>
                )}
                <div>
                  <span className="text-[8px] sm:text-xs text-text-light uppercase tracking-wider">Estado</span>
                  <p className={`font-medium text-xs sm:text-sm ${
                    estado === 'disponible' ? 'text-emerald-600' : 
                    estado === 'reservado' ? 'text-amber-600' : 'text-gray-500'
                  }`}>
                    {getStatusText()}
                  </p>
                </div>
              </div>

              {/* Comentario */}
              {comentario && (
                <div className="bg-secondary-light/20 rounded-lg p-2.5 sm:p-4">
                  <span className="text-[8px] sm:text-xs text-text-light uppercase tracking-wider block mb-0.5 sm:mb-1">
                    Detalle adicional
                  </span>
                  <p className="text-text-secondary text-xs sm:text-sm italic">"{comentario}"</p>
                </div>
              )}

              {/* Botones de compartir y acción - Responsive */}
              <div className="space-y-2 sm:space-y-3">
                <ShareButtons product={product} className="flex-wrap gap-1.5 sm:gap-2" />
                <button className="w-full btn-primary text-center text-xs sm:text-sm py-2 sm:py-3">
                  Consultar en el stand
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;