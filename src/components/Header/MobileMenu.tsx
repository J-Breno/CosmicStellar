import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import StarryBackground from "./StarryBackground";
import type { MenuItem, ScrollableMenuItemId } from "./types";
import { getMenuItemClass } from './utils';

interface MobileMenuProps {
  menuItems: MenuItem[];
  activeSection: string;
  onItemClick: (id: ScrollableMenuItemId) => void;
  onClose: () => void;
}

export default function MobileMenu({ menuItems, activeSection, onItemClick, onClose }: MobileMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: "-100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "-100%" }}
      transition={{ type: "spring", damping: 20 }}
      className="md:hidden fixed top-0 left-0 w-full h-full bg-[#0a0a0a]/95 backdrop-blur-lg z-40"
      onClick={onClose}
    >
      <div className="absolute inset-0 opacity-30">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <StarryBackground />
        </Canvas>
      </div>
      
      <ul className="flex m-20 flex-col items-center justify-center h-full gap-8 relative z-10">
        {menuItems.map((item, index) => {
          // Adicione esta verificação de tipo
          if (item.id === 'logo') return null;
          
          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onItemClick(item.id as ScrollableMenuItemId)}
              className={`text-2xl ${getMenuItemClass(item.id, index, activeSection)} group`}
            >
              <span className="relative">
                {item.label}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </span>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}