import React, { useState, useEffect } from 'react';
import { FiX, FiCalendar, FiClock, FiMapPin, FiInfo, FiShoppingBag, FiArrowRight, FiGrid } from 'react-icons/fi';

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      sessionStorage.setItem('hasSeenWelcome', 'true');
    }, 300);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div 
      className={`fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-gradient-to-br from-white to-secondary-light/30 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden transform transition-all duration-300 mx-2 sm:mx-0 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-primary-dark via-primary to-primary-light p-5 sm:p-6 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/80 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
            aria-label="Cerrar"
          >
            <FiX className="text-xl sm:text-2xl" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30 flex-shrink-0">
              <FiShoppingBag className="text-2xl sm:text-3xl" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-light">Feria de Majo</h2>
              <p className="text-white/80 text-xs sm:text-sm font-light">La Mejor Calidad Y Precio</p>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Fecha y horario */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="bg-primary/5 rounded-xl p-3 sm:p-4 text-center border border-primary/10">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-primary mb-0.5 sm:mb-1">
                <FiCalendar className="text-base sm:text-lg" />
                <span className="font-semibold text-xs sm:text-sm">Fecha</span>
              </div>
              <p className="text-text-primary font-medium text-sm sm:text-base">Sábado 19 de septiembre</p>
              <p className="text-text-light text-xs sm:text-sm">2026</p>
            </div>
            <div className="bg-primary/5 rounded-xl p-3 sm:p-4 text-center border border-primary/10">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-primary mb-0.5 sm:mb-1">
                <FiClock className="text-base sm:text-lg" />
                <span className="font-semibold text-xs sm:text-sm">Horario</span>
              </div>
              <p className="text-text-primary font-medium text-sm sm:text-base">11:00 a 18:00 hs</p>
              <p className="text-text-light text-xs sm:text-sm">Horario corrido</p>
            </div>
          </div>

          {/* Ubicación */}
          <div className="bg-secondary-light/30 rounded-xl p-3 sm:p-4 flex items-center gap-3 border border-secondary-light/50">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <FiMapPin className="text-primary text-base sm:text-lg" />
            </div>
            <div>
              <p className="text-text-secondary text-xs sm:text-sm font-medium">Ubicación</p>
              <p className="text-text-primary font-medium text-sm sm:text-base">Feria de Majo</p>
            </div>
          </div>

          {/* Mensaje especial con lista de productos */}
          <div className="bg-amber-50/80 rounded-xl p-3 sm:p-4 border border-amber-200/50">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <FiGrid className="text-amber-600 text-xs sm:text-sm" />
              </div>
              <div>
                <p className="text-text-primary font-medium text-sm sm:text-base">¡Productos exclusivos en el stand!</p>
                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mt-0.5">
                  En la feria encontrarás una gran variedad de productos que no están en este catálogo:
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="bg-amber-100/70 text-text-secondary text-[10px] sm:text-xs px-2.5 py-1 rounded-full">Carteras</span>
                  <span className="bg-amber-100/70 text-text-secondary text-[10px] sm:text-xs px-2.5 py-1 rounded-full">Bufandas</span>
                  <span className="bg-amber-100/70 text-text-secondary text-[10px] sm:text-xs px-2.5 py-1 rounded-full">Sweaters</span>
                  <span className="bg-amber-100/70 text-text-secondary text-[10px] sm:text-xs px-2.5 py-1 rounded-full">Remeras</span>
                  <span className="bg-amber-100/70 text-text-secondary text-[10px] sm:text-xs px-2.5 py-1 rounded-full">Chaquetas</span>
                  <span className="bg-amber-100/70 text-text-secondary text-[10px] sm:text-xs px-2.5 py-1 rounded-full">Vestidos</span>
                  <span className="bg-amber-100/70 text-text-secondary text-[10px] sm:text-xs px-2.5 py-1 rounded-full">Pantalones</span>
                  <span className="bg-amber-100/70 text-text-secondary text-[10px] sm:text-xs px-2.5 py-1 rounded-full">+ Mucho más</span>
                </div>
                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mt-2">
                  ¡No te los pierdas! Te esperamos con una selección única de prendas de marca en excelente estado.
                </p>
              </div>
            </div>
          </div>

          {/* Botón de cierre */}
          <button
            onClick={handleClose}
            className="w-full btn-primary flex items-center justify-center gap-2 py-2.5 sm:py-3 text-sm sm:text-base"
          >
            Ver catálogo
            <FiArrowRight className="text-base sm:text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;