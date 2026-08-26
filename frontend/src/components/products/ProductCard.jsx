import React from 'react';
import { FiMaximize2, FiTag } from 'react-icons/fi';

const ProductCard = ({ product, onClick }) => {
  const {
    nombre,
    descripcion,
    categoria,
    talle,
    estado,
    imagenes,
    nuevo,
  } = product;

  const getStatusClasses = () => {
    switch (estado) {
      case 'reservado':
        return 'bg-amber-50 text-amber-700';
      case 'archivado':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-emerald-50 text-emerald-700';
    }
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

  const getImageUrl = () => {
    if (imagenes && imagenes.length > 0 && imagenes[0]) {
      return imagenes[0];
    }
    return null;
  };

  return (
    <div 
      className="group bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-hard transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={() => onClick(product)}
    >
      {/* Imagen con aspecto cuadrado perfecto */}
      <div className="relative aspect-square bg-secondary-light/20 overflow-hidden">
        {getImageUrl() ? (
          <img
            src={getImageUrl()}
            alt={nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `
                <div class="w-full h-full flex items-center justify-center bg-secondary-light/30 text-text-light">
                  <span class="text-4xl font-light">${nombre.charAt(0)}</span>
                </div>
              `;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary-light/30 text-text-light">
            <span className="text-4xl font-light">{nombre.charAt(0)}</span>
          </div>
        )}
        
        {/* Badges - Responsive */}
        {nuevo && (
          <span className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-primary text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
            Nuevo
          </span>
        )}
        
        {/* Status Overlay */}
        {estado !== 'disponible' && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center">
            <span className={`text-white font-bold text-xs sm:text-base uppercase tracking-widest px-3 sm:px-6 py-1.5 sm:py-3 rounded-lg border-2 border-white/30 backdrop-blur-sm ${
              estado === 'reservado' ? 'bg-amber-600/80' : 'bg-gray-600/80'
            }`}>
              {estado === 'reservado' ? 'Reservado' : 'Archivado'}
            </span>
          </div>
        )}

        {/* Ver detalles - Visible en hover desktop, siempre visible en mobile con transparencia */}
        <button 
          className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-text-primary px-2 sm:px-4 py-1 sm:py-2 rounded-full text-[10px] sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white shadow-medium flex items-center gap-1 sm:gap-2"
          onClick={(e) => {
            e.stopPropagation();
            onClick(product);
          }}
        >
          <FiMaximize2 className="text-[10px] sm:text-sm" />
          <span className="hidden xs:inline">Ver detalles</span>
          <span className="xs:hidden">Ver</span>
        </button>
      </div>

      {/* Información - Responsive */}
      <div className="p-2 sm:p-3 md:p-4">
        <div className="flex items-start justify-between gap-1 sm:gap-2">
          <h3 className="font-medium text-text-primary text-xs sm:text-sm md:text-base line-clamp-1 flex-1">
            {nombre}
          </h3>
          <span className={`text-[8px] sm:text-[10px] md:text-xs font-semibold px-1.5 sm:px-2.5 py-0.5 rounded-full whitespace-nowrap ${getStatusClasses()}`}>
            {getStatusText()}
          </span>
        </div>
        
        <p className="text-text-secondary text-[10px] sm:text-xs md:text-sm font-light mt-0.5 sm:mt-1 line-clamp-2">
          {descripcion}
        </p>

        <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1 sm:mt-2">
          <span className="text-[8px] sm:text-[10px] md:text-xs bg-secondary-light/50 text-text-secondary px-1.5 sm:px-2.5 py-0.5 rounded-full capitalize">
            {categoria}
          </span>
          <span className="text-[8px] sm:text-[10px] md:text-xs bg-secondary-light/50 text-text-secondary px-1.5 sm:px-2.5 py-0.5 rounded-full uppercase">
            Talle {talle}
          </span>
        </div>
        
        <div className="flex items-center justify-end mt-1.5 sm:mt-3 pt-1 sm:pt-3 border-t border-secondary-light/30">
          <span className="text-[8px] sm:text-[10px] md:text-xs text-text-light flex items-center gap-0.5 sm:gap-1">
            <FiTag className="text-[8px] sm:text-xs" />
            Catálogo
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;