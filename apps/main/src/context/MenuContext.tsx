'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type MenuContextValue = {
  openMenu: boolean;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

const MenuContext = createContext<MenuContextValue | null>(null);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <MenuContext.Provider value={{ openMenu, setOpenMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }

  return context;
};
