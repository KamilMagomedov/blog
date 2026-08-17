"use client";
import NavBar from "@/components/navBar/NavBar";
import { useBurgerMenu } from "@/contexts/BurgerMenu";
import { abrilFatface } from "@/styles/fonts";
import Link from "next/link";

const Aside: React.FC = () => {
  const { isActive, openBurgerMenu } = useBurgerMenu();
  const year = new Date().getFullYear();
  return (
    <aside
      className={`${
        isActive ? "translate-x-0" : "-translate-x-full"
      } fixed inset-y-0 left-0 z-[51] flex h-dvh w-full transform flex-col justify-between overflow-y-auto border-r border-[#e6e6e6] bg-white px-8 py-16 transition-transform duration-500 ease-in-out lg:w-[260px] lg:translate-x-0 lg:px-6 lg:py-12`}
    >
      <NavBar />
      <div>
        <h1>
          <Link
            href="/"
            onClick={openBurgerMenu}
            className={`${abrilFatface.className} bg-custom-text bg-cover bg-clip-text bg-bottom text-4xl font-normal leading-[0.9] text-transparent`}
          >
            Mahomedov Kamil
          </Link>
        </h1>
        <p>Copyright ©{year} All rights reserved.</p>
      </div>
    </aside>
  );
};

export default Aside;
