import React, { createContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { getProducts } from '../api/products';
import apiClient from '../api/client';

export const ProductContext = createContext();

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
      if (!forceRefresh) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setProducts(data);
            setLoading(false);
            setTimeout(() => fetchProducts(true), 100);
            return;
          }
        }
      }

      setLoading(true);
      setError(null);
      const response = await getProducts();
      const productsData = response.data || [];
      
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

  // Actualizar estado de un producto de forma optimista (sin recargar todo)
  const updateProductStatusOptimistic = useCallback(async (productId, newStatus) => {
    // Guardar el estado anterior para revertir si falla
    let previousStatus = null;
    
    // Actualizar la UI inmediatamente
    setProducts(prevProducts => {
      const updated = prevProducts.map(p => {
        if (p._id === productId) {
          previousStatus = p.estado;
          return { ...p, estado: newStatus };
        }
        return p;
      });
      
      // Actualizar el caché local
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: updated,
        timestamp: Date.now()
      }));
      
      return updated;
    });

    // Enviar al servidor en segundo plano
    try {
      await apiClient.patch(`/products/${productId}/status`, { estado: newStatus });
      return { success: true };
    } catch (error) {
      // Si falla, revertir el cambio
      if (previousStatus) {
        setProducts(prevProducts => {
          const reverted = prevProducts.map(p => 
            p._id === productId ? { ...p, estado: previousStatus } : p
          );
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: reverted,
            timestamp: Date.now()
          }));
          return reverted;
        });
      }
      return { success: false, error };
    }
  }, []);

  // Actualizar un producto editado (sin recargar todo)
  const updateProductLocal = useCallback((productId, updatedProduct) => {
    setProducts(prevProducts => {
      const updated = prevProducts.map(p => 
        p._id === productId ? { ...p, ...updatedProduct } : p
      );
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: updated,
        timestamp: Date.now()
      }));
      return updated;
    });
  }, []);

  // Agregar un producto nuevo
  const addProductLocal = useCallback((newProduct) => {
    setProducts(prevProducts => {
      const updated = [newProduct, ...prevProducts];
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: updated,
        timestamp: Date.now()
      }));
      return updated;
    });
  }, []);

  // Eliminar un producto
  const removeProductLocal = useCallback((productId) => {
    setProducts(prevProducts => {
      const updated = prevProducts.filter(p => p._id !== productId);
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: updated,
        timestamp: Date.now()
      }));
      return updated;
    });
  }, []);

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
    updateProductStatusOptimistic,
    updateProductLocal,
    addProductLocal,
    removeProductLocal,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};