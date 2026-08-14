import { lora } from "@/styles/fonts";
import Image from "next/image";
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
    <div className="relative mx-auto mb-[40px] overflow-hidden rounded text-[15px] text-white xs:h-[271px] xs:w-[290px] md:h-[370px] md:w-[520px] 2xl:h-[271px] 2xl:w-[350px]">
      <div className="absolute inset-0 z-0 bg-gray-300">
        <Image
          className="object-cover"
          src="/bg_1.webp"
          alt="Newsletter Background"
          fill
          priority
          placeholder="blur"
          blurDataURL="/bg_1_blur.webp"
          sizes="(max-width: 768px) 100vw, 520px"
        />
      </div>
      <div className="absolute inset-0 z-10 bg-black/60" />
      <div className="relative z-20 flex h-full flex-col justify-between p-6 text-center">
        <div>
          <h3 className={`mb-3 text-xl italic ${lora.className}`}>
            Newsletter
          </h3>
          <p className="mb-4 text-sm leading-relaxed">
            Far far away, behind the word mountains, far from the countries
            Vokalia
          </p>
        </div>

        <form
          className="mx-auto flex w-full max-w-[260px] flex-col"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="mb-2 h-[45px] rounded border border-solid border-[#fff3] bg-transparent px-3 py-[6px] text-center text-base font-black placeholder-white placeholder-opacity-70 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="h-[45px] rounded bg-white px-3 py-[6px] text-base font-semibold text-black transition-colors hover:bg-gray-100"
          >
            Subscribe
          </button>
        </form>
      </div>

      {showMessage && error && (
        <p className="absolute inset-0 z-30 flex animate-fadeOut items-center justify-center bg-[#000000d1] p-4 text-center text-[1.1rem] text-red-500">
          {error}
        </p>
      )}
      {showMessage && success && (
        <p className="absolute inset-0 z-30 flex animate-fadeOut items-center justify-center bg-[#000000d1] p-4 text-center text-[1.4rem] text-green-500">
          Subscribed successfully!
        </p>
      )}
    </div>
  );
};

export default Newsletter;
