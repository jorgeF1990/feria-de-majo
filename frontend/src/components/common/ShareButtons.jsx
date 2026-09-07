import React from 'react';
import {
  WhatsappShareButton,
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  EmailShareButton,
  WhatsappIcon,
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  EmailIcon,
} from 'react-share';
import { FiShare2 } from 'react-icons/fi';

const ShareButtons = ({ product, className = '' }) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const productUrl = `${baseUrl}/producto/${product._id}`;
  
  const title = `${product.nombre} - Feria de Majo`;

  const whatsappMessage = `*${product.nombre}*\n\n${product.descripcion}\n\nCategoría: ${product.categoria}\nTalle: ${product.talle.toUpperCase()}\nColor: ${product.color}${product.material ? `\nMaterial: ${product.material}` : ''}\n\nFeria de Majo\nSábado 19 de septiembre\n11:00 a 18:00 hs\n\n${productUrl}`;

  const emailBody = `Te comparto esta prenda de la Feria de Majo:\n\n${product.nombre}\n${product.descripcion}\n\nCategoría: ${product.categoria}\nTalle: ${product.talle.toUpperCase()}\nColor: ${product.color}${product.material ? `\nMaterial: ${product.material}` : ''}\n\nFeria de Majo\nSábado 19 de septiembre\n11:00 a 18:00 hs\n\n${productUrl}`;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-xs text-text-light uppercase tracking-wider mr-1 flex items-center gap-1">
        <FiShare2 className="text-sm" />
        Compartir
      </span>

      <WhatsappShareButton
        url={productUrl}
        title={whatsappMessage}
        separator=" "
        className="hover:scale-110 transition-transform duration-200"
      >
        <WhatsappIcon size={36} round />
      </WhatsappShareButton>

      <FacebookShareButton
        url={productUrl}
        quote={title}
        hashtag="#FeriaDeMajo"
        className="hover:scale-110 transition-transform duration-200"
      >
        <FacebookIcon size={36} round />
      </FacebookShareButton>

      <TwitterShareButton
        url={productUrl}
        title={title}
        hashtags={['FeriaDeMajo', 'ModaArtesanal']}
        className="hover:scale-110 transition-transform duration-200"
      >
        <TwitterIcon size={36} round />
      </TwitterShareButton>

      <TelegramShareButton
        url={productUrl}
        title={whatsappMessage}
        className="hover:scale-110 transition-transform duration-200"
      >
        <TelegramIcon size={36} round />
      </TelegramShareButton>

      <EmailShareButton
        url={productUrl}
        subject={title}
        body={emailBody}
        className="hover:scale-110 transition-transform duration-200"
      >
        <EmailIcon size={36} round />
      </EmailShareButton>
    </div>
  );
};

export default ShareButtons;