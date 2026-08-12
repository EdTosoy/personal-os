"use client";
import React, { useState, createContext } from "react";

type ContextProps = {
  openMenu: boolean;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

export const MenuContext = createContext<ContextProps>({
  openMenu: false,
  setOpenMenu: () => {},
});

type Props = {
  children: React.ReactNode;
};
export const MenuProvider = ({ children }: Props) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  return (
    <MenuContext.Provider
      value={{
        openMenu,
        setOpenMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
