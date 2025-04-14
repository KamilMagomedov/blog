import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Aside from "@/components/aside/Aside";
import "@/styles/globals.css";
import BurgerMenu from "@/components/burgerMenu/BurgerMenu";
import { BurgerMenuProvider } from "@/contexts/BurgerMenu";
import { ModalProvider } from "@/contexts/ModalContext";
import Modal from "@/components/modal/Modal";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kamil's Blog | Travel and Programming",
  description:
    "Kamil's personal blog. I share my travel experiences and insights into programming. Articles, tips, and inspiration!",
  keywords: ["blog", "programming", "travel", "Next.js", "React"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          as="image"
          href="/bg_1.webp"
          imageSrcSet="/bg_1.webp 1x"
          imageSizes="(max-width: 768px) 100vw, 520px"
        />
      </head>
      <body className={`${poppins.className} antialiased`}>
        <BurgerMenuProvider>
          <ModalProvider>
            <main className="relative h-full w-full xs:overflow-y-auto">
              <BurgerMenu />
              <Aside />
              {children}
              <Modal />
            </main>
          </ModalProvider>
        </BurgerMenuProvider>
      </body>
    </html>
  );
}
