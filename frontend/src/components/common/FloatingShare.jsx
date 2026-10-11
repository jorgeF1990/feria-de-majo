import React, { useState } from 'react';
import {
  WhatsappShareButton,
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton,
  WhatsappIcon,
  FacebookIcon,
  TwitterIcon,
  EmailIcon,
} from 'react-share';
import { FiShare2, FiX } from 'react-icons/fi';

const FloatingShare = () => {
  const [isOpen, setIsOpen] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  
  const title = 'Feria de Majo - Nueva edición';
  
  // SIN URL al final - react-share la agrega automáticamente
  const message = `Nueva edición de Feria de Majo

Sábado 17 de octubre
11:00 a 18:00 hs

Encontrá:
Carteras - Bufandas - Sweaters - Remeras
Vestidos - Pantalones - Camperas - Tapados
Y mucho más

Todo de marca, en excelente estado
Precios increíbles

Te esperamos`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-hard p-3 border border-secondary-light/30 flex flex-col gap-2">
          <button
            onClick={() => setIsOpen(false)}
            className="self-end p-1 hover:bg-secondary-light/30 rounded-full transition-colors"
          >
            <FiX className="text-text-secondary text-lg" />
          </button>
          <WhatsappShareButton url={url} title={message} className="hover:scale-110 transition-transform duration-200">
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>
          <FacebookShareButton url={url} quote={title} className="hover:scale-110 transition-transform duration-200">
            <FacebookIcon size={40} round />
          </FacebookShareButton>
          <TwitterShareButton url={url} title={title} className="hover:scale-110 transition-transform duration-200">
            <TwitterIcon size={40} round />
          </TwitterShareButton>
          <EmailShareButton 
            url={url} 
            subject={title} 
            body={message} 
            className="hover:scale-110 transition-transform duration-200"
          >
            <EmailIcon size={40} round />
          </EmailShareButton>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white p-4 rounded-full shadow-hard hover:shadow-lg transition-all hover:scale-105"
        >
          <FiShare2 className="text-2xl" />
        </button>
      )}
    </div>
  );
};

export default FloatingShare;