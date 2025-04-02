"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { disLikePost, likePost } from "@/lib/api";

const LikeButton: React.FC<{ initialLikes: number; id: number }> = ({
  initialLikes,
  id,
}) => {
  const [amountLike, setAmountLike] = useState<number>(initialLikes);
  const [animate, setAnimate] = useState<boolean>(false);
  const getLikesFromStorage = (): number[] => {
    const likes: string | null = localStorage.getItem("likes");
    const decodeLikes: number[] = likes ? JSON.parse(likes) : [];
    return decodeLikes;
  };
  const [like, setLike] = useState<boolean>(getLikesFromStorage().includes(id));

  const handleLike = () => {
    let decodeLikes = getLikesFromStorage();

    if (decodeLikes?.includes(id)) {
      setAmountLike((prev) => (prev > 0 ? prev - 1 : 0));
      setLike(false);
      decodeLikes = decodeLikes.filter((paramId: number) => {
        return paramId !== id;
      });
      disLikePost(id);
    } else {
      setAmountLike((prev) => prev + 1);
      setLike(true);
      likePost(id);
      decodeLikes?.push(id);
    }
    localStorage.setItem("likes", JSON.stringify(decodeLikes));
    setAnimate(true);

    setTimeout(() => {
      setAnimate(false);
    }, 800);
  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-2 rounded-lg px-3 py-1 text-gray-700 transition hover:text-red-500"
    >
      <div className={`transition ${like ? "scale-125" : "scale-100"}`}>
        <Heart fill={like ? "red" : "none"} className="h-6 w-6" />
      </div>
      <span
        className={`font-semibold text-gray-800 ${animate ? "animate-like" : ""}`}
      >
        {amountLike}
      </span>
    </button>
  );
};

export default LikeButton;
