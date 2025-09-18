import { MENU_ITEMS } from "./constants";

export type MenuItemId = typeof MENU_ITEMS[number]['id'];

export type MenuItem = {
  id: MenuItemId;
  label: string | null;
};

export type ScrollableMenuItemId = Exclude<MenuItemId, 'logo'>;