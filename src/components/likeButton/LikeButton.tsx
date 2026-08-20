"use client";

import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { disLikePost, likePost } from "@/lib/clientApi";

interface ILikeButtonProps {
  initialLikes: number;
  id: number | string;
}

const LikeButton: React.FC<ILikeButtonProps> = ({ initialLikes, id }) => {
  const numericId = Number(id);

  const [amountLike, setAmountLike] = useState<number>(initialLikes);
  const [animate, setAnimate] = useState<boolean>(false);
  const [like, setLike] = useState<boolean>(false);

  useEffect(() => {
    const likes = localStorage.getItem("likes");
    const decodeLikes: number[] = likes ? JSON.parse(likes) : [];

    // Restore the liked state from browser storage after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLike(decodeLikes.includes(numericId));
  }, [numericId]);

  const handleLike = () => {
    const likes: string | null = localStorage.getItem("likes");
    let decodeLikes: number[] = likes ? JSON.parse(likes) : [];

    if (decodeLikes.includes(numericId)) {
      setAmountLike((prev) => (prev > 0 ? prev - 1 : 0));
      setLike(false);
      decodeLikes = decodeLikes.filter(
        (paramId: number) => paramId !== numericId,
      );
      disLikePost(numericId);
    } else {
      setAmountLike((prev) => prev + 1);
      setLike(true);
      likePost(numericId);
      decodeLikes.push(numericId);
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
        className={`font-semibold text-gray-800 ${
          animate ? "animate-like" : ""
        }`}
      >
        {amountLike}
      </span>
    </button>
  );
};

export default LikeButton;
