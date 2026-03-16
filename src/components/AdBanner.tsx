'use client';

import { useEffect } from 'react';

interface AdBannerProps {
  dataAdSlot: string; // Este ID te lo da Google al crear un "Bloque de anuncios"
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
}

export default function AdBanner({ dataAdSlot, dataAdFormat = "auto", dataFullWidthResponsive = true }: AdBannerProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e: any) {
      console.error("Error en AdSense:", e.message);
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', margin: '20px 0', overflow: 'hidden', minHeight: '100px' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3038983835600086"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      />
    </div>
  );
}