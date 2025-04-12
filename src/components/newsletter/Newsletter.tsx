import { lora } from "@/styles/fonts";
import React, { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!API_URL) {
      setError("API URL is not defined");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/v1/blog/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.errors?.email?.[0] || "Something went wrong");
        setShowMessage(true);
        return;
      }

      setSuccess(true);
      setEmail("");
      setError(null);
      setShowMessage(true);
    } catch (err) {
      setError(`Failed to connect to the server ${err}`);
      setShowMessage(true);
    }
  };

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
        setSuccess(false);
        setError(null);

        return () => clearTimeout(timer);
      }, 3000);
    }
  }, [showMessage]);

  return (
    <div className="relative z-0 mx-auto mb-[40px] bg-[url(/bg_1.webp)] bg-cover bg-center bg-no-repeat px-[25px] text-[15px] text-white xs:h-[271px] xs:w-[290px] md:h-[370px] md:w-[520px] 2xl:h-[271px] 2xl:w-[350px]">
      <div className="absolute inset-0 z-[-1] bg-black opacity-60"></div>
      <h3 className={`mb-[30px] text-xl italic ${lora.className}`}>
        Newsletter
      </h3>
      <p className="mb-6">
        Far far away, behind the word mountains, far from the countries Vokalia
      </p>
      <form
        className="absolute bottom-0 left-2/4 flex -translate-x-1/2 flex-col"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="mb-2 h-[52px] rounded border border-solid border-[#fff3] bg-inherit px-3 py-[6px] text-base font-black placeholder-white placeholder-opacity-70"
          required
        />
        <button
          type="submit"
          className="h-[52px] bg-white px-3 py-[6px] text-base text-black"
        >
          Subscribe
        </button>
      </form>
      {showMessage && error && (
        <p className="absolute bottom-0 left-0 right-0 top-0 flex h-full w-full animate-fadeOut items-center justify-center bg-[#000000d1] text-[1.1rem] text-red-500 decoration-solid">
          {error}
        </p>
      )}
      {showMessage && success && (
        <p className="absolute bottom-0 left-0 right-0 top-0 flex h-full w-full animate-fadeOut items-center justify-center bg-[#000000d1] text-[1.4rem] text-green-500 decoration-solid">
          Subscribed successfully!
        </p>
      )}
    </div>
  );
};

export default Newsletter;
