"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({ error }: { error: Error }) {
  useEffect(() => {
    console.error("Ошибка:", error);
  }, [error]);

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 z-[1100] flex min-h-screen flex-col items-center justify-center bg-[#0000009e] bg-gray-100 p-6 text-center">
      <h1 className="text-4xl font-bold text-red-600">
        Oops! Something went wrong.
      </h1>
      <p className="mt-2 text-lg text-red-600">
        {error.message || "An unexpected error occurred"}
      </p>
      <Link
        href="/"
        className="rounded-2 mt-4 inline-block bg-blue-600 px-4 py-2 text-white"
      >
        Go to home.
      </Link>
    </div>
  );
}
