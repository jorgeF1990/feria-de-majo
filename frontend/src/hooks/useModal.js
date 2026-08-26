import { useState, useCallback } from 'react';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openModal = useCallback((product) => {
    setSelectedProduct(product);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedProduct(null);
    document.body.style.overflow = 'unset';
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
    selectedProduct,
  };
};