import { motion } from 'framer-motion';
import type { MenuItem, ScrollableMenuItemId } from "./types";
import { getMenuItemClass } from './utils';
import LogoAnimated from './LogoAnimated';

interface DesktopMenuProps {
  menuItems: readonly MenuItem[];
  activeSection: string;
  onItemClick: (id: ScrollableMenuItemId) => void;
}

const menuItemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
};

export default function DesktopMenu({ menuItems, activeSection, onItemClick }: DesktopMenuProps) {
  return (
    <ul className="hidden md:flex gap-10 items-center">
      {menuItems.map((item, index) => (
        <motion.li
          key={item.id}
          initial="hidden"
          animate="visible"
          variants={menuItemVariants}
          transition={{ delay: index * 0.1 }}
          onClick={() => {
            if (item.id !== "logo") {
              onItemClick(item.id as ScrollableMenuItemId); 
            }
          }}
          className={`${getMenuItemClass(item.id, index, activeSection)} group relative`}
        >
          {item.id === "logo" ? (
            <motion.div whileHover={{ scale: 1.05 }}>
              <LogoAnimated />
            </motion.div>
          ) : (
            <span className="relative">
              {item.label}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              <span className="absolute -inset-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </span>
          )}
        </motion.li>
      ))}
    </ul>
  );
}