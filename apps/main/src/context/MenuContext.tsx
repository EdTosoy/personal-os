'use client';

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

type MenuContextValue = {
  openMenu: boolean;
  setOpenMenu: Dispatch<SetStateAction<boolean>>;
};

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

type MenuProviderProps = {
  children: ReactNode;
};

export function MenuProvider({ children }: MenuProviderProps) {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <MenuContext.Provider value={{ openMenu, setOpenMenu }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }

  return context;
}
