import React from 'react';
import ProductCard from './ProductCard';
import Loader from '../common/Loader';

const ProductGrid = ({ products, loading, onProductClick }) => {
  if (loading) {
    return <Loader />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-soft">
        <div className="max-w-sm mx-auto px-4">
          <p className="text-text-secondary text-lg">No se encontraron productos</p>
          <p className="text-text-light text-sm mt-2">Intentá con otros filtros de búsqueda</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id || product.id}
          product={product}
          onClick={onProductClick}
        />
      ))}
    </div>
  );
};

export default ProductGrid;