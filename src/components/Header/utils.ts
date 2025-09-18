import type { MenuItemId } from "./types";

export const getMenuItemClass = (itemId: MenuItemId, index: number, activeSection: string) => {
  const baseClasses = "cursor-pointer text-[16px] tracking-[0.2em] transition-all duration-300";
  const activeClass = activeSection === itemId
    ? "text-[#F9FAFB] glow-text"
    : "text-[#F9FAFB]/60 hover:text-[#F9FAFB] hover:glow-text";
  const spacingClass = index === 2 ? "px-8" : "";
  

  return `${baseClasses} ${activeClass} ${spacingClass}`;
};