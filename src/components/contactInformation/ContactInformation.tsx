"use client";

import ContactSkeleton from "@/app/contact/ui/ContactSkeleton";
import { getContactItems } from "@/lib/api";
import { getFullPath } from "@/lib/googleMaps";
import { lora } from "@/styles/fonts";
import { IContactInformation } from "@/types/ContactInformation";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";

const ContactInformation: React.FC = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [contactInformations, setContactInformations] = useState<
    IContactInformation[] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getContactItems();

        if (data?.success && Array.isArray(data.data)) {
          setContactInformations(data.data);
        } else {
          console.error("Invalid contact information format", data);
          setContactInformations([]);
        }
      } catch (error) {
        console.error("Error fetching contact information", error);
        setContactInformations([]);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const inform = (key: string): IContactInformation | undefined =>
    Array.isArray(contactInformations)
      ? contactInformations.find(
          (item) => item.title.toLowerCase() === key.toLowerCase(),
        )
      : undefined;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inform("Phone")?.value as string);
    setIsCopied(true);
  };

  const address = inform("Location")?.value as string;
  const googleMapsUrl = getFullPath(address);

  if (loading) {
    return <ContactSkeleton />;
  }

  return (
    <Suspense fallback={<ContactSkeleton />}>
      <h2
        className={`${lora.className} mb-6 text-[1.75rem] font-normal leading-6 text-black xs:text-center lg:text-left`}
      >
        Contact Information
      </h2>

      <div className="flex gap-5 xs:flex-col lg:mb-10 lg:flex-row lg:flex-wrap lg:justify-between xl:flex-nowrap xl:justify-normal">
        <InfoCard>
          <Link
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
          >
            Address:{" "}
            <span className="hover:text-[#1eafed]">
              {inform("Location")?.value}
            </span>
            <Tooltip>Click to open the map.</Tooltip>
          </Link>
        </InfoCard>

        <InfoCard>
          <button onClick={copyToClipboard} className="group relative">
            Phone:{" "}
            <span className="hover:text-[#1eafed]">
              {inform("Phone")?.value}
            </span>
            <Tooltip>Click to copy phone number.</Tooltip>
            {isCopied && <Tooltip>Copied!</Tooltip>}
          </button>
        </InfoCard>

        <InfoCard>
          Email:{" "}
          <Link
            href={`mailto:${inform("Email")?.value}`}
            className="group relative break-words hover:text-[#1eafed]"
          >
            {inform("Email")?.value}
            <Tooltip>Click to write a letter.</Tooltip>
          </Link>
        </InfoCard>

        <InfoCard>
          Website:{" "}
          <Link
            href="https://kamilintech.shop/"
            className="group relative hover:text-[#1eafed]"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://kamilintech.shop/
            <Tooltip>Click to open my Website.</Tooltip>
          </Link>
        </InfoCard>
      </div>
    </Suspense>
  );
};

const InfoCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-6 bg-[#f8f9fa] p-6 px-[15px] text-black xs:min-h-[70px] xs:w-full xs:text-center lg:min-h-[170px] lg:w-[45%] xl:w-1/4">
    {children}
  </div>
);

const Tooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="absolute bottom-full left-1/2 mb-2 w-max -translate-x-1/2 scale-0 rounded bg-gray-800 px-4 py-2 text-sm text-white shadow-lg transition-all group-hover:scale-100">
    {children}
  </div>
);

export default ContactInformation;
