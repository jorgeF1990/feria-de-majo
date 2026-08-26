import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ProductCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const defaultImages = images && images.length > 0 ? images : ['https://via.placeholder.com/400x400/EAE5DE/6B6258?text=Feria+de+Majo'];

  useEffect(() => {
    if (defaultImages.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % defaultImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [defaultImages.length, isHovered]);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % defaultImages.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + defaultImages.length) % defaultImages.length);
  };

  return (
    <div 
      className="relative w-full aspect-square bg-secondary-light/20 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {defaultImages.map((img, idx) => (
          <div key={idx} className="min-w-full h-full flex items-center justify-center p-2">
            <img
              src={img}
              alt={`Producto ${idx + 1}`}
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {defaultImages.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-soft transition-all hover:scale-110"
          >
            <FiChevronLeft className="text-text-secondary text-lg" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-soft transition-all hover:scale-110"
          >
            <FiChevronRight className="text-text-secondary text-lg" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {defaultImages.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-primary w-4' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductCarousel;