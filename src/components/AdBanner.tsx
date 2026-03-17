'use client';

import { useEffect, useState } from 'react';

interface AdBannerProps {
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function AdBanner({
  dataAdSlot,
  dataAdFormat = 'auto',
  dataFullWidthResponsive = true,
  style,
  className = ''
}: AdBannerProps) {
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLocalhost(window.location.hostname === 'localhost');
    }

    try {
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
    } catch (error) {
      console.error('Error al cargar el anuncio de AdSense:', error);
    }
  }, []);

  const PUBLISHER_ID = "ca-pub-3038983835600086"; 

  return (
    <div 
      className={`ad-container ${isLocalhost ? 'is-localhost' : ''} ${className}`}
      style={style}
    >
      <span className="ad-placeholder">Espacio<br/>publicitario</span>
      <ins
        className="adsbygoogle"
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}