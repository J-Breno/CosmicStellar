export const MENU_ITEMS = [
  { id: 'home', label: 'HOME' },
  { id: 'resources', label: 'RECURSOS ESPACIAIS' },
  { id: 'logo', label: null },
  { id: 'facts', label: 'FATOS ESPACIAIS' },
  { id: 'contact', label: 'CONTATO' }
] as const;

export const SECTION_IDS = MENU_ITEMS.map(item => item.id).filter(id => id !== 'logo');