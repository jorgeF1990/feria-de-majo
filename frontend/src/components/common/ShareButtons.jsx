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
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const title = `${product.nombre} - Feria de Majo`;
  const description = product.descripcion.substring(0, 100) + '...';
  const hashtags = ['FeriaDeMajo', 'ModaArtesanal', 'IndumentariaUnica'];

  const whatsappMessage = `*${product.nombre}*\n\n${product.descripcion}\n\nCategoria: ${product.categoria}\nTalle: ${product.talle.toUpperCase()}\nColor: ${product.color}\n${product.material ? `Material: ${product.material}\n` : ''}\n\nFeria de Majo - 19 y 20 de septiembre de 2026\n\n${url}`;

  const emailSubject = `${product.nombre} - Feria de Majo`;
  const emailBody = `Te comparto esta prenda de la Feria de Majo:\n\n${product.nombre}\n${product.descripcion}\n\nCategoria: ${product.categoria}\nTalle: ${product.talle.toUpperCase()}\nColor: ${product.color}\n${product.material ? `Material: ${product.material}\n` : ''}\n\nFeria de Majo - 19 y 20 de septiembre de 2026\n\n${url}`;

  const shareUrl = url;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-xs text-text-light uppercase tracking-wider mr-1 flex items-center gap-1">
        <FiShare2 className="text-sm" />
        Compartir
      </span>

      <WhatsappShareButton
        url={shareUrl}
        title={whatsappMessage}
        separator=" "
        className="hover:scale-110 transition-transform duration-200"
      >
        <WhatsappIcon size={36} round />
      </WhatsappShareButton>

      <FacebookShareButton
        url={shareUrl}
        quote={title}
        hashtag="#FeriaDeMajo"
        className="hover:scale-110 transition-transform duration-200"
      >
        <FacebookIcon size={36} round />
      </FacebookShareButton>

      <TwitterShareButton
        url={shareUrl}
        title={title}
        hashtags={hashtags}
        className="hover:scale-110 transition-transform duration-200"
      >
        <TwitterIcon size={36} round />
      </TwitterShareButton>

      <TelegramShareButton
        url={shareUrl}
        title={whatsappMessage}
        className="hover:scale-110 transition-transform duration-200"
      >
        <TelegramIcon size={36} round />
      </TelegramShareButton>

      <EmailShareButton
        url={shareUrl}
        subject={emailSubject}
        body={emailBody}
        className="hover:scale-110 transition-transform duration-200"
      >
        <EmailIcon size={36} round />
      </EmailShareButton>
    </div>
  );
};

export default ShareButtons;