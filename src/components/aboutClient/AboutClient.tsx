"use client";

import AboutSkeleton from "@/app/about/ui/AboutSkeleton";
import { sendDataToBackend } from "@/lib/clientApi";
import { Data } from "@/types/AboutAuthorInfromation";
import Image from "next/image";
import React, { useEffect } from "react";

interface IAboutClientProps {
  aboutAuthorInform?: Data | null;
}

const AboutClient: React.FC<IAboutClientProps> = ({ aboutAuthorInform }) => {
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const type = window.location.href;

    sendDataToBackend({
      userAgent,
      language,
      type,
    });
  }, []);

  if (!aboutAuthorInform) {
    return <AboutSkeleton />;
  }

  const mainImage = aboutAuthorInform.image || "/image_not_found.webp";

  return (
    <section className="min-h-screen w-full xl:flex xl:items-center">
      <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-10 px-5 py-10 lg:px-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:items-center xl:gap-14">
        <div className="relative min-h-[360px] overflow-hidden rounded-[20px] sm:min-h-[500px] xl:min-h-[620px]">
          <Image
            src={mainImage}
            alt={aboutAuthorInform.name ?? "Kamil Mahomedov"}
            fill
            sizes="(max-width: 1279px) 100vw, 45vw"
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="min-w-0">
          <h2 className="mb-6 text-center text-3xl font-semibold leading-[1.15] text-black sm:text-4xl xl:text-left xl:text-5xl">
            I am{" "}
            <span className="font-black text-[#1eafed]">
              {aboutAuthorInform.name ?? "Unknown Author"}
            </span>
            , a Frontend Developer based in London.
          </h2>

          <div className="space-y-4 text-center leading-7 text-gray-600 xl:text-left">
            {aboutAuthorInform.text ? (
              aboutAuthorInform.text
                .trim()
                .split(/\n\s*\n/)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph.trim()}</p>
                ))
            ) : (
              <p>No description available.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutClient;
