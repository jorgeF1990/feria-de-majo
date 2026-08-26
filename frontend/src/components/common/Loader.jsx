import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-text-secondary text-sm">Cargando productos...</p>
      </div>
    </div>
  );
};

export default Loader;