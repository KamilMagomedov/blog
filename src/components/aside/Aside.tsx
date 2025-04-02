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
      className={`${isActive ? "xs:translate-x-0" : "xs:-translate-x-full"} fixed bottom-0 left-0 right-0 top-0 z-[51] flex h-full transform flex-col justify-between overflow-y-hidden border-r-[1px] border-solid border-r-[#e6e6e6] bg-white pb-10 pl-[2em] pr-[2em] pt-[5em] transition-transform duration-500 ease-in-out lg:flex lg:w-1/4 lg:translate-x-0`}
    >
      <NavBar />
      <div>
        <h1>
          <Link
            href="/"
            onClick={openBurgerMenu}
            className={`${abrilFatface.className} bg-custom-text bg-cover bg-clip-text bg-bottom text-5xl font-normal leading-[0.8] text-transparent lg:text-4xl xl:text-5xl`}
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
