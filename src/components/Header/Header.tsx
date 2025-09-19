'use client';
import { useState, useRef } from "react";
import { AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { useActiveSection } from "../../hooks/useActiveSection";
import { MENU_ITEMS, SECTION_IDS } from "./constants";
import { type MenuItem, ScrollableMenuItemId } from "./types";
import { useScrollDetection } from "@/hooks/useScrollDetection";
import HamburgerButton from "./HamburgerButton";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";
import StarryBackground from "./StarryBackground";
import LogoAnimated from "./LogoAnimated";
import { scrollToSection } from "@/hooks/scrollUtils";

export default function Header() {
  const activeSection = useActiveSection(SECTION_IDS);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrolled = useScrollDetection(10);
  const headerRef = useRef<HTMLElement>(null);

  const handleScrollToSection = (id: ScrollableMenuItemId) => {
    scrollToSection(id);
    setIsMenuOpen(false);
  };

  return (
    <header 
      ref={headerRef}
      className={`backdrop-blur-[1px] bg-[#0a0a0a]/30 border-b border-[#ffffff]/30 sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'} shadow-[0_4px_6px_-1px_rgba(255,255,255,0.3)]`}
      // VOLTEI para sticky (que é o correto para acompanhar scroll)
    >
      <div className="absolute inset-0 -z-10 opacity-30">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <StarryBackground />
        </Canvas>
      </div>
      
      <nav className="flex items-center justify-center p-4 relative">
        <HamburgerButton 
          isOpen={isMenuOpen} 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
        />
        
        <div className="md:hidden absolute left-1/2 -translate-x-1/2">
          <LogoAnimated />
        </div>

        <DesktopMenu 
            menuItems={MENU_ITEMS as readonly MenuItem[]} 
            activeSection={activeSection}
            onItemClick={handleScrollToSection}
        />

        <AnimatePresence>
          {isMenuOpen && (
            <MobileMenu
                menuItems={MENU_ITEMS.filter((item) => item.id !== "logo") as MenuItem[]}
                activeSection={activeSection}
                onItemClick={handleScrollToSection}
                onClose={() => setIsMenuOpen(false)}
            />
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}