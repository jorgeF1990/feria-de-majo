import React, { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';
import ProductModal from '../components/products/ProductModal';
import { useProducts } from '../hooks/useProducts';
import { useModal } from '../hooks/useModal';
import { FiArrowRight } from 'react-icons/fi';

const Home = () => {
  const { products, loading, filters, setFilters, filteredProducts } = useProducts();
  const { isOpen, openModal, closeModal, selectedProduct } = useModal();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
    setFilters({ ...filters, search: term });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={handleSearch} />
      
      <main className="flex-1 container-custom py-8">
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-secondary to-secondary-light rounded-xl p-8 md:p-12 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-primary-dark text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              Colección Primavera 2026
            </span>
            <h1 className="text-3xl md:text-5xl font-light text-text-primary mb-4">
              Moda con <span className="font-semibold text-primary">alma artesanal</span>
            </h1>
            <p className="text-text-secondary text-lg font-light mb-6">
              Prendas únicas confeccionadas con materiales nobles y técnicas tradicionales.
            </p>
            <button className="btn-secondary inline-flex items-center gap-2">
              Explorar colección
              <FiArrowRight className="text-lg" />
            </button>
          </div>
        </section>

        {/* Filtros */}
        <ProductFilters filters={filters} setFilters={setFilters} />

        {/* Grid de Productos */}
        <ProductGrid
          products={filteredProducts}
          loading={loading}
          onProductClick={openModal}
        />
      </main>

      <Footer />

      {/* Modal de Producto */}
      <ProductModal
        isOpen={isOpen}
        onClose={closeModal}
        product={selectedProduct}
      />
    </div>
  );
};

export default Home;