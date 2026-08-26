import React, { useState, useEffect, useRef } from 'react';
import { 
  FiSearch, 
  FiUser, 
  FiShoppingBag, 
  FiMenu, 
  FiLogOut,
  FiFilter,
  FiX,
  FiChevronDown
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';
import LoginModal from '../auth/LoginModal';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { filters, updateFilter, clearFilters } = useProducts();
  const [searchValue, setSearchValue] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const filterButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Sincronizar searchValue con filters.search
  useEffect(() => {
    if (filters?.search) {
      setSearchValue(filters.search);
    } else {
      setSearchValue('');
    }
  }, [filters?.search]);

  // Cerrar filtros al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterButtonRef.current && filterButtonRef.current.contains(event.target)) {
        return;
      }
      if (filterRef.current && filterRef.current.contains(event.target)) {
        return;
      }
      setIsFilterOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar menú móvil al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (value) => {
    setSearchValue(value);
    if (value && value.trim() !== '') {
      updateFilter('search', value.trim());
    } else {
      updateFilter('search', '');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue && searchValue.trim() !== '') {
      updateFilter('search', searchValue.trim());
    } else {
      updateFilter('search', '');
    }
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getActiveFiltersCount = () => {
    if (!filters) return 0;
    return Object.keys(filters).filter(key => key !== 'search').length;
  };

  const activeCount = getActiveFiltersCount();

  const categories = [
    { value: 'todos', label: 'Todas' },
    { value: 'vestidos', label: 'Vestidos' },
    { value: 'blusas', label: 'Blusas' },
    { value: 'pantalones', label: 'Pantalones' },
    { value: 'camperas', label: 'Camperas' },
    { value: 'tapados', label: 'Tapados' },
    { value: 'carteras', label: 'Carteras' },
    { value: 'sweaters', label: 'Sweaters' },
    { value: 'chaquetas', label: 'Chaquetas' },
    { value: 'accesorios', label: 'Accesorios' }
  ];

  const sizes = [
    { value: 'todos', label: 'Todos' },
    { value: 's', label: 'S' },
    { value: 'm', label: 'M' },
    { value: 'l', label: 'L' },
    { value: 'xl', label: 'XL' },
    { value: 'unico', label: 'Único' }
  ];

  const colors = [
    { value: 'todos', label: 'Todos' },
    { value: 'neutro', label: 'Neutro' },
    { value: 'tierra', label: 'Tierra' },
    { value: 'azul', label: 'Azul' },
    { value: 'verde', label: 'Verde' },
    { value: 'rojo', label: 'Rojo' },
    { value: 'negro', label: 'Negro' }
  ];

  const isFilterActive = (type, value) => {
    if (value === 'todos') {
      return !filters?.[type];
    }
    return filters?.[type] === value;
  };

  const handleFilterChange = (type, value) => {
    if (value === 'todos') {
      updateFilter(type, '');
    } else {
      updateFilter(type, value);
    }
  };

  const handleClearAllFilters = () => {
    clearFilters();
    setSearchValue('');
    setIsFilterOpen(false);
  };

  const goToAdmin = () => {
    window.location.href = '/admin';
    setIsMobileMenuOpen(false);
  };

  const goToHome = () => {
    window.location.href = '/';
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-primary-dark to-primary sticky top-0 z-50 shadow-medium">
        <div className="container-custom py-2 sm:py-3">
          {/* Fila principal */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo */}
            <div 
              className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0 cursor-pointer"
              onClick={goToHome}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/10">
                <span className="text-white text-sm sm:text-xl font-light tracking-wider">FM</span>
              </div>
              <h1 className="text-sm sm:text-xl md:text-2xl font-medium text-white tracking-tight">
                Feria<span className="font-light opacity-80 hidden xs:inline"> de Majo</span>
              </h1>
            </div>

            {/* Búsqueda - Desktop */}
            <form onSubmit={handleSubmit} className="hidden md:flex flex-1 max-w-2xl relative">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Buscar prendas..."
                  value={searchValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/10 text-white placeholder:text-white/60 rounded-full py-2 sm:py-2.5 pl-10 sm:pl-12 pr-28 sm:pr-32 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm sm:text-base"
                />
                <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white/60 text-base sm:text-lg" />
                
                <div className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 sm:gap-1">
                  <button
                    ref={filterButtonRef}
                    type="button"
                    onClick={toggleFilter}
                    className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-sm font-medium transition-all ${
                      isFilterOpen || activeCount > 0
                        ? 'bg-white/20 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    <FiFilter className="text-xs sm:text-sm" />
                    <span className="hidden xs:inline">Filtros</span>
                    {activeCount > 0 && (
                      <span className="bg-white/30 text-white text-[8px] sm:text-xs font-bold px-1 sm:px-1.5 py-0.5 rounded-full min-w-[16px] sm:min-w-[20px] text-center">
                        {activeCount}
                      </span>
                    )}
                    <FiChevronDown className={`text-[10px] sm:text-sm transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {searchValue && (
                    <button
                      type="button"
                      onClick={() => handleSearchChange('')}
                      className="text-white/60 hover:text-white transition-colors p-0.5 sm:p-1"
                    >
                      <FiX className="text-xs sm:text-sm" />
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Acciones - Desktop */}
            <div className="hidden md:flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
              {isAuthenticated ? (
                <>
                  <span className="text-white/80 text-xs sm:text-sm">
                    {user?.username}
                  </span>
                  <button
                    onClick={goToAdmin}
                    className="bg-white text-primary px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full font-medium hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm md:text-base"
                  >
                    <FiShoppingBag className="text-sm sm:text-lg" />
                    <span className="hidden xs:inline">Panel Admin</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-white/80 hover:text-white transition-colors p-1 sm:p-2 rounded-full hover:bg-white/10"
                  >
                    <FiLogOut className="text-lg sm:text-xl" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="text-white hover:text-white/80 transition-colors p-1 sm:p-2 rounded-full hover:bg-white/10"
                  >
                    <FiUser className="text-lg sm:text-xl" />
                  </button>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="bg-white text-primary px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full font-medium hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm md:text-base"
                  >
                    <FiShoppingBag className="text-sm sm:text-lg" />
                    <span className="hidden xs:inline">Acceder</span>
                  </button>
                </>
              )}
            </div>

            {/* Botón Hamburguesa - Mobile */}
            <div className="flex md:hidden items-center gap-1">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <FiUser className="text-xl" />
              </button>
              <button 
                className="text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
                onClick={toggleMobileMenu}
                aria-label="Menú"
              >
                {isMobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
              </button>
            </div>
          </div>

          {/* Búsqueda móvil */}
          <div className="md:hidden mt-2 sm:mt-3">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                placeholder="Buscar prendas..."
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/10 text-white placeholder:text-white/60 rounded-full py-1.5 sm:py-2.5 pl-9 sm:pl-12 pr-16 sm:pr-20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-xs sm:text-sm"
              />
              <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white/60 text-sm sm:text-lg" />
              <div className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 sm:gap-1">
                <button
                  type="button"
                  onClick={toggleFilter}
                  className={`p-1 sm:p-1.5 rounded-full transition-all ${
                    isFilterOpen || activeCount > 0
                      ? 'bg-white/20 text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <FiFilter className="text-xs sm:text-sm" />
                </button>
                {searchValue && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange('')}
                    className="text-white/60 hover:text-white transition-colors p-0.5 sm:p-1"
                  >
                    <FiX className="text-xs sm:text-sm" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Menú móvil desplegable */}
          <div
            ref={mobileMenuRef}
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'max-h-[300px] opacity-100 mt-2' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="text-white text-sm font-medium">
                    {user?.username}
                  </div>
                  <button
                    onClick={goToAdmin}
                    className="w-full bg-white text-primary px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <FiShoppingBag />
                    Panel Admin
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-white/10 text-white px-4 py-2 rounded-full font-medium hover:bg-white/20 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <FiLogOut />
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-white text-primary px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <FiShoppingBag />
                  Iniciar sesión
                </button>
              )}
            </div>
          </div>

          {/* Panel de filtros desplegable - Responsive */}
          <div
            ref={filterRef}
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              isFilterOpen ? 'max-h-[800px] opacity-100 mt-2 sm:mt-3' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <h3 className="text-white font-medium text-xs sm:text-sm">Filtros</h3>
                <div className="flex items-center gap-2 sm:gap-3">
                  {activeCount > 0 && (
                    <button
                      onClick={handleClearAllFilters}
                      className="text-white/70 hover:text-white text-[10px] sm:text-xs transition-colors flex items-center gap-0.5 sm:gap-1 bg-white/10 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full hover:bg-white/20"
                    >
                      <FiX className="text-[8px] sm:text-xs" />
                      Limpiar todo
                    </button>
                  )}
                  <button
                    onClick={toggleFilter}
                    className="text-white/70 hover:text-white transition-colors p-0.5 sm:p-1 rounded-full hover:bg-white/10"
                  >
                    <FiX className="text-xs sm:text-sm" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {/* Categorías */}
                <div>
                  <span className="text-white/60 text-[8px] sm:text-xs uppercase tracking-wider font-semibold">Categoría</span>
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1 sm:mt-1.5">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => handleFilterChange('categoria', cat.value)}
                        className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-medium transition-all ${
                          isFilterActive('categoria', cat.value)
                            ? 'bg-white text-primary'
                            : 'bg-white/10 text-white/80 hover:bg-white/20'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {/* Talles */}
                  <div>
                    <span className="text-white/60 text-[8px] sm:text-xs uppercase tracking-wider font-semibold">Talle</span>
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1 sm:mt-1.5">
                      {sizes.map((size) => (
                        <button
                          key={size.value}
                          onClick={() => handleFilterChange('talle', size.value)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-[8px] sm:text-xs font-medium transition-all flex items-center justify-center ${
                            isFilterActive('talle', size.value)
                              ? 'bg-white text-primary'
                              : 'bg-white/10 text-white/80 hover:bg-white/20'
                          }`}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colores */}
                  <div>
                    <span className="text-white/60 text-[8px] sm:text-xs uppercase tracking-wider font-semibold">Color</span>
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1 sm:mt-1.5">
                      {colors.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => handleFilterChange('color', color.value)}
                          className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-medium transition-all ${
                            isFilterActive('color', color.value)
                              ? 'bg-white text-primary'
                              : 'bg-white/10 text-white/80 hover:bg-white/20'
                          }`}
                        >
                          {color.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Estado */}
                <div>
                  <span className="text-white/60 text-[8px] sm:text-xs uppercase tracking-wider font-semibold block mb-1 sm:mb-2">Estado</span>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    <button
                      onClick={() => handleFilterChange('estado', '')}
                      className={`px-2 sm:px-4 py-0.5 sm:py-1.5 rounded-full text-[8px] sm:text-xs font-medium transition-all ${
                        !filters?.estado
                          ? 'bg-white text-primary'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => handleFilterChange('estado', 'disponible')}
                      className={`px-2 sm:px-4 py-0.5 sm:py-1.5 rounded-full text-[8px] sm:text-xs font-medium transition-all flex items-center gap-0.5 sm:gap-1.5 ${
                        filters?.estado === 'disponible'
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${filters?.estado === 'disponible' ? 'bg-white' : 'bg-emerald-400'}`}></span>
                      Disponible
                    </button>
                    <button
                      onClick={() => handleFilterChange('estado', 'reservado')}
                      className={`px-2 sm:px-4 py-0.5 sm:py-1.5 rounded-full text-[8px] sm:text-xs font-medium transition-all flex items-center gap-0.5 sm:gap-1.5 ${
                        filters?.estado === 'reservado'
                          ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${filters?.estado === 'reservado' ? 'bg-white' : 'bg-amber-400'}`}></span>
                      Reservado
                    </button>
                    <button
                      onClick={() => handleFilterChange('estado', 'archivado')}
                      className={`px-2 sm:px-4 py-0.5 sm:py-1.5 rounded-full text-[8px] sm:text-xs font-medium transition-all flex items-center gap-0.5 sm:gap-1.5 ${
                        filters?.estado === 'archivado'
                          ? 'bg-gray-500 text-white shadow-lg shadow-gray-500/30'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${filters?.estado === 'archivado' ? 'bg-white' : 'bg-gray-400'}`}></span>
                      Archivado
                    </button>
                  </div>
                </div>

                {/* Filtros activos */}
                {activeCount > 0 && (
                  <div className="pt-2 sm:pt-3 border-t border-white/10">
                    <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                      {Object.entries(filters)
                        .filter(([key]) => key !== 'search')
                        .map(([key, value]) => {
                          const labels = {
                            categoria: categories.find(c => c.value === value)?.label || value,
                            talle: sizes.find(s => s.value === value)?.label || value,
                            color: colors.find(c => c.value === value)?.label || value,
                            estado: value === 'disponible' ? 'Disponible' : 
                                     value === 'reservado' ? 'Reservado' : 
                                     value === 'archivado' ? 'Archivado' : value
                          };
                          const label = labels[key] || value;
                          return (
                            <span
                              key={key}
                              className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 bg-white/20 text-white rounded-full text-[8px] sm:text-xs"
                            >
                              {label}
                              <button
                                onClick={() => {
                                  updateFilter(key, '');
                                }}
                                className="hover:text-red-300 transition-colors ml-0.5"
                              >
                                <FiX className="text-[6px] sm:text-xs" />
                              </button>
                            </span>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </>
  );
};

export default Header;