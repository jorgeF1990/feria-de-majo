import React, { createContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { getProducts } from '../api/products';

export const ProductContext = createContext();

// Cache local para evitar recargas
const CACHE_KEY = 'feria-de-majo-products';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const initialLoadDone = useRef(false);

  const fetchProducts = useCallback(async (forceRefresh = false) => {
    try {
      // Intentar cargar desde cache local primero
      if (!forceRefresh) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setProducts(data);
            setLoading(false);
            // Refrescar en segundo plano
            setTimeout(() => fetchProducts(true), 100);
            return;
          }
        }
      }

      setLoading(true);
      setError(null);
      const response = await getProducts();
      const productsData = response.data || [];
      
      // Guardar en cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: productsData,
        timestamp: Date.now()
      }));
      
      setProducts(productsData);
    } catch (err) {
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      fetchProducts();
    }
  }, [fetchProducts]);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const updateFilter = useCallback((key, value) => {
    if (value === 'todos' || value === 'todas' || value === '' || value === null || value === undefined) {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters(newFilters);
    } else {
      setFilters({ ...filters, [key]: value });
    }
  }, [filters]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (Object.keys(filters).length === 0) {
      return result;
    }

    if (filters.categoria) {
      result = result.filter(p => p.categoria === filters.categoria);
    }

    if (filters.talle) {
      result = result.filter(p => p.talle === filters.talle);
    }

    if (filters.color) {
      result = result.filter(p => p.color === filters.color);
    }

    if (filters.estado) {
      result = result.filter(p => p.estado === filters.estado);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase().trim();
      result = result.filter(p =>
        p.nombre?.toLowerCase().includes(searchLower) ||
        p.descripcion?.toLowerCase().includes(searchLower) ||
        p.categoria?.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [products, filters]);

  const value = {
    products,
    loading,
    error,
    filters,
    setFilters,
    clearFilters,
    updateFilter,
    filteredProducts,
    refetch: () => fetchProducts(true),
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};