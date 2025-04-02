export interface INavPage {
  title: string;
  href: string;
  external?: boolean;
}

export const navPages: INavPage[] = [
  { title: "Home", href: "/" },
  { title: "Development", href: "/development" },
  { title: "Travel", href: "/travel" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
  {
    title: "Portfolio",
    href: "https://kamilintech.shop/about",
    external: true,
  },
];
