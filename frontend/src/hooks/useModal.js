import { useState, useCallback } from 'react';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openModal = useCallback((product) => {
    console.log(' Abriendo modal para:', product?.nombre);
    setSelectedProduct(product);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    console.log(' Cerrando modal');
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