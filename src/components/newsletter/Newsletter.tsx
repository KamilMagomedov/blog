import { lora } from "@/styles/fonts";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong");
        setShowMessage(true);
        return;
      }

      setSuccess(true);
      setEmail("");
      setError(null);
      setShowMessage(true);
    } catch (error) {
      console.error("Newsletter error:", error);

      setError("Failed to connect to the server");
      setShowMessage(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!showMessage) return;

    const timer = setTimeout(() => {
      setShowMessage(false);
      setSuccess(false);
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showMessage]);

  return (
    <div className="relative mx-auto mb-10 h-[271px] w-full max-w-[360px] overflow-hidden rounded text-[15px] text-white xl:max-w-none">
      <div className="absolute inset-0 z-0 bg-gray-300">
        <Image
          className="object-cover"
          src="/bg_1.webp"
          alt="Newsletter Background"
          fill
          priority
          placeholder="blur"
          blurDataURL="/bg_1_blur.webp"
          sizes="(max-width: 768px) 100vw, 340px"
        />
      </div>

      <div className="absolute inset-0 z-10 bg-black/60" />

      <div className="relative z-20 flex h-full flex-col justify-between p-6 text-center">
        <div>
          <h3 className={`mb-3 text-xl italic ${lora.className}`}>
            Newsletter
          </h3>

          <p className="mb-4 text-sm leading-relaxed">
            Get occasional updates about my development projects, tech meetups
            and travel stories.
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
            placeholder="Email address"
            autoComplete="email"
            className="mb-2 h-[45px] w-full rounded border border-solid border-[#fff3] bg-transparent px-3 py-[6px] text-center text-base font-black placeholder-white placeholder-opacity-70 focus:outline-none"
            required
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-[45px] w-full rounded bg-white px-3 py-[6px] text-base font-semibold text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
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
