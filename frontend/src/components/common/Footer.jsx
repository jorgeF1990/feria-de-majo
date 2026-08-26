import React from 'react';
import { FiHeart, FiLinkedin, FiGlobe, FiArrowUp } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-white border-t border-secondary-light/30">
      <div className="container-custom py-6 md:py-8">
        <div className="flex flex-col items-center gap-4">
          {/* Botón Volver arriba */}
          <button
            onClick={scrollToTop}
            className="p-3 bg-primary/10 rounded-full hover:bg-primary/20 transition-all hover:scale-110 transform group"
            aria-label="Volver arriba"
          >
            <FiArrowUp className="text-primary text-xl group-hover:-translate-y-1 transition-transform" />
          </button>

          {/* Marca */}
          <div className="text-center">
            <h3 className="font-medium text-text-primary text-lg">Feria de Majo</h3>
            <p className="text-text-secondary text-sm"> Descubrí Piezas Con La Mejor Calidad Y Precio</p>
          </div>

          {/* Enlaces sociales */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/jorge-fern%C3%A1ndez-montaner-50115412b/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-secondary-light/30 rounded-full hover:bg-secondary-light/60 transition-colors hover:scale-105 transform"
              aria-label="LinkedIn"
            >
              <FiLinkedin className="text-text-secondary text-xl" />
            </a>
            <a
              href="https://jorgea-fernandezm.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-secondary-light/30 rounded-full hover:bg-secondary-light/60 transition-colors hover:scale-105 transform"
              aria-label="Portafolio"
            >
              <FiGlobe className="text-text-secondary text-xl" />
            </a>
          </div>

          {/* Derechos */}
          <div className="text-center pt-2 border-t border-secondary-light/20 w-full max-w-xs">
            <p className="text-text-light text-xs flex items-center justify-center gap-1">
              Hecho con <FiHeart className="text-red-500 text-xs" /> por Jorge Fernández
            </p>
            <p className="text-text-light text-[10px] mt-0.5">
              © {currentYear} Feria de Majo · Todos los derechos reservados
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;