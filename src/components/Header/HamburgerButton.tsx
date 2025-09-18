import { motion } from 'framer-motion';

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function HamburgerButton({ isOpen, onClick }: HamburgerButtonProps) {
  return (
    <motion.button
      className="md:hidden absolute left-4 text-white z-50"
      onClick={onClick}
      aria-label="Abrir menu"
      whileTap={{ scale: 0.9 }}
    >
      <div
        className={`w-6 h-0.5 bg-white mb-1.5 transition-transform ${
          isOpen ? "rotate-45 translate-y-2" : ""
        }`}
      ></div>
      <div
        className={`w-6 h-0.5 bg-white mb-1.5 ${
          isOpen ? "opacity-0" : ""
        }`}
      ></div>
      <div
        className={`w-6 h-0.5 bg-white transition-transform ${
          isOpen ? "-rotate-45 -translate-y-2" : ""
        }`}
      ></div>
    </motion.button>
  );
}