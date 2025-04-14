import { Inter } from "next/font/google";
import type { AppProps } from "next/app";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <Component {...pageProps} />
    </div>
  );
}
