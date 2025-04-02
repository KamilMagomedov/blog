"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { BurgerMenu } from "@/types/BurgerMenu";

const burgerMenuContext = createContext<BurgerMenu>({
  isActive: false,
  openBurgerMenu: () => {},
});

export const BurgerMenuProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isActive, setIsActive] = useState(false);

  const openBurgerMenu = () => setIsActive((prevState) => !prevState);

  return (
    <burgerMenuContext.Provider value={{ isActive, openBurgerMenu }}>
      {children}
    </burgerMenuContext.Provider>
  );
};

export const useBurgerMenu = (): BurgerMenu => {
  return useContext(burgerMenuContext);
};
