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

      <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <InfoCard>
          <div className="flex flex-col items-center gap-2">
            <span className="font-medium">Address</span>

            <Link
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/tooltip relative transition-colors hover:text-[#1eafed]"
            >
              {inform("Location")?.value || "N/A"}

              <Tooltip>Click to open the map.</Tooltip>
            </Link>
          </div>
        </InfoCard>

        <InfoCard>
          <div className="flex flex-col items-center gap-2">
            <span className="font-medium">Phone</span>

            <button
              onClick={copyToClipboard}
              className="group/tooltip relative transition-colors hover:text-[#1eafed]"
            >
              {inform("Phone")?.value || "N/A"}

              <Tooltip>
                {isCopied ? "Copied!" : "Click to copy phone number."}
              </Tooltip>
            </button>
          </div>
        </InfoCard>

        <InfoCard>
          <div className="flex flex-col items-center gap-2">
            <span className="font-medium">Email</span>

            <Link
              href={`mailto:${inform("Email")?.value}`}
              className="group/tooltip relative break-all transition-colors hover:text-[#1eafed]"
            >
              {inform("Email")?.value || "N/A"}

              <Tooltip>Click to write a letter.</Tooltip>
            </Link>
          </div>
        </InfoCard>
      </div>
    </>
  );
};

const InfoCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex min-h-[150px] items-center justify-center rounded-lg bg-[#f8f9fa] p-6 text-center text-black">
    {children}
  </div>
);

const Tooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="pointer-events-none invisible absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-[220px] -translate-x-1/2 rounded bg-gray-800 px-3 py-2 text-center text-sm text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover/tooltip:visible group-hover/tooltip:opacity-100">
    {children}
  </div>
);

export default ContactInformation;
