import React, { useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import { AuthProvider } from './context/AuthContext';
import { useProducts } from './hooks/useProducts';
import { useAuth } from './hooks/useAuth';
import { useModal } from './hooks/useModal';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProductGrid from './components/products/ProductGrid';
import ProductModal from './components/products/ProductModal';
import Admin from './pages/Admin';
import FloatingShare from './components/common/FloatingShare';
import { 
  FiArrowRight, 
  FiSettings, 
  FiLock, 
  FiCalendar, 
  FiMapPin, 
  FiClock
} from 'react-icons/fi';

const HomeContent = () => {
  const { filteredProducts, loading } = useProducts();
  const { isOpen, openModal, closeModal, selectedProduct } = useModal();
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const productGridRef = useRef(null);

  // Scroll a la sección de productos
  const scrollToProducts = () => {
    if (productGridRef.current) {
      productGridRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container-custom py-8">
        <div className="flex justify-end mb-4">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark transition-colors px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20"
            >
              <FiSettings />
              Panel de administración
            </button>
          ) : (
            <div className="flex items-center gap-2 text-sm text-text-light">
              <FiLock className="text-xs" />
              <span>Inicia sesión para administrar</span>
            </div>
          )}
        </div>

        {/* Hero Banner */}
        <section className="relative rounded-xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary to-primary-light">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`
            }}></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -ml-36 -mb-36"></div>
          </div>

          <div className="relative z-10 p-8 md:p-12 text-white">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/10">
                <FiCalendar className="text-white/80" />
                <span className="text-sm font-medium tracking-wide">
                  Septiembre 2026
                </span>
                <FiMapPin className="text-white/80 ml-2" />
                <span className="text-sm font-light">Feria de Majo</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-light leading-tight mb-4">
                <span className="block">Descubrí piezas</span>
                <span className="font-semibold text-white">con la mejor calidad y precio</span>
              </h1>
              
              <p className="text-white/80 text-lg font-light mb-8 max-w-xl">
                Prendas usadas de marca, en excelente estado y con la mejor calidad. 
                Encontra piezas únicas con estilo y a precios increíbles. 
                 Te esperamos en septiembre en nuestra feria. Horarios a consultar.
              </p>

              <button 
                onClick={scrollToProducts}
                className="bg-white text-primary px-8 py-3 rounded-full font-medium hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                Ver colección
                <FiArrowRight className="text-lg" />
              </button>
            </div>
          </div>
        </section>

        {/* Info rápida */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-soft p-6 text-center hover:shadow-medium transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiCalendar className="text-primary text-xl" />
            </div>
            <h4 className="font-medium text-text-primary">Septiembre 2026</h4>
            <p className="text-text-secondary text-sm">Fecha a confirmar</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-6 text-center hover:shadow-medium transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiClock className="text-primary text-xl" />
            </div>
            <h4 className="font-medium text-text-primary">Horario a consultar</h4>
            <p className="text-text-secondary text-sm">Te avisaremos pronto</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-6 text-center hover:shadow-medium transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiMapPin className="text-primary text-xl" />
            </div>
            <h4 className="font-medium text-text-primary">Feria de Majo</h4>
            <p className="text-text-secondary text-sm">Te esperamos</p>
          </div>
        </div>

        {/* Product Grid con ref para scroll */}
        <div ref={productGridRef}>
          <ProductGrid
            products={filteredProducts}
            loading={loading}
            onProductClick={openModal}
          />
        </div>
      </main>

      <Footer />
      <FloatingShare />
      <ProductModal
        isOpen={isOpen}
        onClose={closeModal}
        product={selectedProduct}
      />
    </div>
  );
};

// Componente AdminWrapper para proteger la ruta
const AdminWrapper = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !isAdmin) {
    navigate('/');
    return null;
  }

  return (
    <div>
      <div className="bg-primary text-white py-3 px-6 flex justify-between items-center">
        <span className="font-medium">Panel de Administración</span>
        <button
          onClick={() => navigate('/')}
          className="bg-white/20 hover:bg-white/30 px-4 py-1 rounded-full text-sm transition-colors"
        >
          Volver al catálogo
        </button>
      </div>
      <Admin />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <Routes>
          <Route path="/" element={<HomeContent />} />
          <Route path="/admin" element={<AdminWrapper />} />
        </Routes>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;