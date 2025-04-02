"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBurgerMenu } from "@/contexts/BurgerMenu";
import { navPages } from "@/data/navPages";

const NavBar: React.FC = () => {
  const { openBurgerMenu } = useBurgerMenu();
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClasses = (href: string) =>
    `relative inline-block py-[10px] text-[#000000b3] transition-colors duration-300 ${
      isActive(href) ? "text-[#1eafed]" : "hover:text-[#1eafed]"
    } after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:scale-x-0 after:bg-[#1eafed] after:transition-transform after:duration-300 ${
      isActive(href) ? "after:scale-x-100" : "hover:after:scale-x-100"
    }`;

  return (
    <nav>
      <ul className="flex flex-col">
        {navPages.map((page) => (
          <li key={page.href} className="text-lg font-medium">
            {page.external ? (
              <a
                href={page.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClasses(page.href)}
              >
                {page.title}
              </a>
            ) : (
              <Link
                href={page.href}
                onClick={openBurgerMenu}
                className={linkClasses(page.href)}
              >
                {page.title}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
