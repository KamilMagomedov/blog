"use client";
import ContactSkeleton from "@/app/contact/ui/ContactSkeleton";
import { Data } from "@/types/AboutAuthorInfromation";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface IAboutClientProps {
  aboutAuthorInform: Data;
}
const AboutClient: React.FC<IAboutClientProps> = ({ aboutAuthorInform }) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (aboutAuthorInform !== null || aboutAuthorInform !== undefined) {
      setLoading(false);
    }
  }, [aboutAuthorInform]);

  if (loading) {
    return <ContactSkeleton />;
  }

  return (
    <section className="float-right flex h-full xs:w-full xs:flex-col lg:w-3/4 xl:flex-row">
      <div className="relative h-full w-1/2 xs:min-h-full xs:w-full">
        <Image
          src={aboutAuthorInform.image ?? "/image_not_found.webp"}
          alt="My_photo"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-[20px] object-cover"
          priority
        />
      </div>
      <div className="flex w-1/2 items-center px-[15px] pt-12 xs:w-full xs:text-center xl:text-left">
        <div className="lg:px-6">
          <h2 className="text-5xl font-semibold leading-[1.2] text-black xs:text-[2rem]">
            I am{" "}
            <span className="font-black text-[#1eafed]">
              {aboutAuthorInform?.name ?? "Unknown Author"}
            </span>
            , a passionate Frontend Developer & Tech Enthusiast.
          </h2>
          <p
            className="xs:pb-[30px]"
            dangerouslySetInnerHTML={{
              __html:
                aboutAuthorInform?.text || "<p>No description available.</p>",
            }}
          ></p>
        </div>
      </div>
    </section>
  );
};

export default AboutClient;
