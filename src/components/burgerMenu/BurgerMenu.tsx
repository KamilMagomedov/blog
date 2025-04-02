"use client";
import { useBurgerMenu } from "@/contexts/BurgerMenu";

const BurgerMenu: React.FC = () => {
  const { isActive, openBurgerMenu } = useBurgerMenu();

  return (
    <div className="lg:hidden">
      <button
        className={`fixed top-4 z-[50] flex flex-col items-center justify-center p-3 transition-transform duration-500 ease-in-out focus:outline-none ${isActive ? "translate-x-[calc(100vw-60px)]" : "translate-x-0"} `}
        onClick={openBurgerMenu}
        aria-label="Toggle Menu"
      >
        <span
          className={`h-[2px] w-8 bg-black transition-transform duration-300 ease-in-out ${
            isActive ? "translate-y-[8px] rotate-45" : "translate-y-0 rotate-0"
          }`}
        ></span>
        <span
          className={`my-[6px] h-[2px] w-8 bg-black transition-opacity duration-200 ease-in-out ${
            isActive ? "opacity-0" : "opacity-100"
          }`}
        ></span>
        <span
          className={`h-[2px] w-8 bg-black transition-transform duration-300 ease-in-out ${
            isActive
              ? "-translate-y-[8px] -rotate-45"
              : "translate-y-0 rotate-0"
          }`}
        ></span>
      </button>
    </div>
  );
};

export default BurgerMenu;
