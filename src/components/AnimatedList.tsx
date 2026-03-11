'use client';

import { motion } from 'framer-motion';
import './AnimatedList.css';

interface AnimatedListProps {
  items?: any[]; // La hacemos opcional con el '?'
  renderItem: (item: any, index: number) => React.ReactNode;
  showGradients?: boolean;
  displayScrollbar?: boolean;
}

export default function AnimatedList({ 
  items = [], // Si no viene nada, que sea un array vacío por defecto
  renderItem, 
  showGradients = true, 
  displayScrollbar = false 
}: AnimatedListProps) {
  
  // Si items no es un array, nos aseguramos de que no explote
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div style={{ position: 'relative' }}>
      {showGradients && <div className="list-gradient-top" />}
      
      <div className={`animated-list-container ${!displayScrollbar ? 'no-scrollbar' : ''}`}>
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            show: { transition: { staggerChildren: 0.05 } }
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '20px 0' }}
        >
          {safeItems.map((item, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 15 },
                show: { opacity: 1, y: 0 }
              }}
            >
              {renderItem(item, index)}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {showGradients && <div className="list-gradient-bottom" />}
    </div>
  );
}