'use client';

import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  ariaLabel?: string;
}

// Shell compartido para modales tipo "card sobre overlay": centra el
// contenido, cierra con click afuera y con Escape. El contenido y sus
// estilos siguen siendo responsabilidad de quien lo usa (className/
// overlayClassName), esto solo unifica el comportamiento que antes cada
// modal reimplementaba por separado (y varios sin soporte de Escape).
export default function Modal({ isOpen, onClose, children, className, overlayClassName, ariaLabel }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={overlayClassName ?? 'modal-overlay'} role="presentation" onClick={onClose}>
      <div
        className={className}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
