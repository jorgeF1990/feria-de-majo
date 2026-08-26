import React, { useState, useEffect, useRef } from 'react';
import { 
  FiX, 
  FiChevronDown, 
  FiFilter, 
  FiSearch,
  FiSliders
} from 'react-icons/fi';

const ProductFilters = ({ filters, setFilters }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const filterRef = useRef(null);

  const categories = [
    { value: 'todos', label: 'Todas las categorías', icon: '📋' },
    { value: 'vestidos', label: 'Vestidos', icon: '👗' },
    { value: 'blusas', label: 'Blusas', icon: '👚' },
    { value: 'pantalones', label: 'Pantalones', icon: '👖' },
    { value: 'camperas', label: 'Camperas', icon: '🧥' },
    { value: 'tapados', label: 'Tapados', icon: '🧥' },
    { value: 'carteras', label: 'Carteras', icon: '👜' },
    { value: 'sweaters', label: 'Sweaters', icon: '🧶' },
    { value: 'chaquetas', label: 'Chaquetas', icon: '🧥' },
    { value: 'accesorios', label: 'Accesorios', icon: '💍' }
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

  // Cerrar filtros al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== (filters.search || '')) {
        setFilters({ ...filters, search: searchInput || undefined });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, filters, setFilters]);

  const handleFilterChange = (type, value) => {
    if (value === 'todos' || value === 'todas') {
      const newFilters = { ...filters };
      delete newFilters[type];
      setFilters(newFilters);
    } else {
      setFilters({ ...filters, [type]: value });
    }
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchInput('');
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key => key !== 'search').length;
  };

  const activeCount = getActiveFiltersCount();

  const isActive = (type, value) => {
    if (value === 'todos' || value === 'todas') {
      return !filters[type];
    }
    return filters[type] === value;
  };

  return (
    <div className="bg-white rounded-xl shadow-soft mb-6 overflow-hidden">
      {/* Header con búsqueda y filtros */}
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light text-lg" />
              <input
                type="text"
                placeholder="Buscar prendas..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-secondary-light/20 border border-secondary-light/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text-primary placeholder:text-text-light"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light hover:text-text-secondary transition-colors"
                >
                  <FiX className="text-lg" />
                </button>
              )}
            </div>
          </div>

          {/* Botón de filtros */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                isFilterOpen || activeCount > 0
                  ? 'bg-primary text-white shadow-medium'
                  : 'bg-secondary-light/30 text-text-secondary hover:bg-secondary-light/50'
              }`}
            >
              <FiSliders className="text-lg" />
              <span>Filtros</span>
              {activeCount > 0 && (
                <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-1">
                  {activeCount}
                </span>
              )}
              <FiChevronDown className={`text-lg transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {activeCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-text-light hover:text-text-secondary transition-colors flex items-center gap-1 px-3 py-2 rounded-full hover:bg-secondary-light/20"
              >
                <FiX className="text-sm" />
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Panel de filtros */}
      <div
        ref={filterRef}
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isFilterOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 md:p-6 border-t border-secondary-light/30 space-y-6">
          {/* Categorías - Grid visual */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-light mb-3">
              Categoría
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleFilterChange('categoria', cat.value)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-center ${
                    isActive('categoria', cat.value)
                      ? 'bg-primary text-white shadow-soft'
                      : 'bg-secondary-light/20 text-text-secondary hover:bg-secondary-light/40'
                  }`}
                >
                  <span className="block text-lg mb-1">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Talles */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-light mb-3">
                Talle
              </h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => handleFilterChange('talle', size.value)}
                    className={`w-12 h-12 rounded-full text-sm font-medium transition-all flex items-center justify-center ${
                      isActive('talle', size.value)
                        ? 'bg-primary text-white shadow-soft'
                        : 'bg-secondary-light/20 text-text-secondary hover:bg-secondary-light/40'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Colores */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-light mb-3">
                Color
              </h4>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleFilterChange('color', color.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isActive('color', color.value)
                        ? 'bg-primary text-white shadow-soft'
                        : 'bg-secondary-light/20 text-text-secondary hover:bg-secondary-light/40'
                    }`}
                  >
                    {color.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Estado rápido */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-light mb-3">
                Estado
              </h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const newFilters = { ...filters };
                    delete newFilters['estado'];
                    setFilters(newFilters);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !filters.estado
                      ? 'bg-primary text-white shadow-soft'
                      : 'bg-secondary-light/20 text-text-secondary hover:bg-secondary-light/40'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => handleFilterChange('estado', 'disponible')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filters.estado === 'disponible'
                      ? 'bg-emerald-500 text-white shadow-soft'
                      : 'bg-secondary-light/20 text-text-secondary hover:bg-secondary-light/40'
                  }`}
                >
                  Disponible
                </button>
                <button
                  onClick={() => handleFilterChange('estado', 'reservado')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filters.estado === 'reservado'
                      ? 'bg-amber-500 text-white shadow-soft'
                      : 'bg-secondary-light/20 text-text-secondary hover:bg-secondary-light/40'
                  }`}
                >
                  Reservado
                </button>
                <button
                  onClick={() => handleFilterChange('estado', 'archivado')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filters.estado === 'archivado'
                      ? 'bg-gray-500 text-white shadow-soft'
                      : 'bg-secondary-light/20 text-text-secondary hover:bg-secondary-light/40'
                  }`}
                >
                  Archivado
                </button>
              </div>
            </div>
          </div>

          {/* Filtros activos */}
          {activeCount > 0 && (
            <div className="pt-4 border-t border-secondary-light/30">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-text-light">Filtros aplicados:</span>
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
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs"
                      >
                        {label}
                        <button
                          onClick={() => {
                            const newFilters = { ...filters };
                            delete newFilters[key];
                            setFilters(newFilters);
                          }}
                          className="hover:text-red-500 transition-colors ml-1"
                        >
                          <FiX className="text-xs" />
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
  );
};

export default ProductFilters;