"use client";

import { sendDataToBackend } from "@/lib/clientApi";
import { getFullPath } from "@/lib/googleMaps";
import { lora } from "@/styles/fonts";
import { IContactInformation } from "@/types/ContactInformation";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface IContactProps {
  initialContacts: IContactInformation[];
}

const ContactInformation: React.FC<IContactProps> = ({
  initialContacts = [],
}) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sendDataToBackend({
        userAgent: navigator.userAgent,
        language: navigator.language,
        type: window.location.href,
      });
    }
  }, []);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const inform = (key: string): IContactInformation | undefined => {
    const contacts = initialContacts ?? [];
    return contacts.find(
      (item) => item?.title?.toLowerCase() === key.toLowerCase(),
    );
  };

  const copyToClipboard = () => {
    const phone = inform("Phone")?.value;
    if (phone) {
      navigator.clipboard.writeText(phone);
      setIsCopied(true);
    }
  };

  const address = inform("Location")?.value || "";
  const googleMapsUrl = getFullPath(address);

  return (
    <>
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
              {inform("Location")?.value || "N/A"}
            </span>
            <Tooltip>Click to open the map.</Tooltip>
          </Link>
        </InfoCard>

        <InfoCard>
          <button onClick={copyToClipboard} className="group relative">
            Phone:{" "}
            <span className="hover:text-[#1eafed]">
              {inform("Phone")?.value || "N/A"}
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
            {inform("Email")?.value || "N/A"}
            <Tooltip>Click to write a letter.</Tooltip>
          </Link>
        </InfoCard>
      </div>
    </>
  );
};

const InfoCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-6 bg-[#f8f9fa] p-6 px-[15px] text-black xs:min-h-[70px] xs:w-full xs:text-center lg:min-h-[170px] lg:w-[45%] xl:w-1/3">
    {children}
  </div>
);

const Tooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="absolute bottom-full left-1/2 mb-2 w-max -translate-x-1/2 scale-0 rounded bg-gray-800 px-4 py-2 text-sm text-white shadow-lg transition-all group-hover:scale-100">
    {children}
  </div>
);

export default ContactInformation;
