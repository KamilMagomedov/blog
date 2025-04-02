"use client";

import { IPost } from "@/types/Posts";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface ISliderPostsProps {
  post: IPost;
}
const SliderPost: React.FC<ISliderPostsProps> = ({ post }) => {
  const images = post.images;
  const extendedImages = [images[images.length - 1], ...images, images[0]];
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(1);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true);

  useEffect(() => {
    if (currentImageIndex === extendedImages.length - 1) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentImageIndex(1);
      }, 300);
    }
    if (currentImageIndex === 0) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentImageIndex(extendedImages.length - 2);
      }, 300);
    }
  }, [currentImageIndex, extendedImages.length]);

  useEffect(() => {
    if (!isTransitioning) {
      setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
    }
  }, [isTransitioning]);

  if (images.length === 0) {
    return (
      <div className="relative mx-auto mb-6 flex h-[300px] max-w-[600px] items-center justify-center overflow-hidden rounded-xl bg-gray-200 text-gray-500">
        No image
      </div>
    );
  }

  const nextSlide = () => {
    if (!isTransitioning) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prevIndex) => prevIndex + 1);
  };

  const prevSlide = () => {
    if (!isTransitioning) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prevIndex) => prevIndex - 1);
  };

  return (
    <div className="relative mx-auto mb-6 max-w-[600px] overflow-hidden rounded-xl bg-gray-200">
      <div className="relative flex h-[270px] w-full">
        <button
          onClick={prevSlide}
          className="absolute left-[10px] top-1/2 z-10 -translate-y-[50%] cursor-pointer rounded-full bg-[#241f2852] text-white"
        >
          <CircleArrowLeft size={36} />
        </button>

        <div
          className={`flex w-full ${
            isTransitioning
              ? "transition-transform duration-300 ease-in-out"
              : ""
          }`}
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {extendedImages.map((image, i) => (
            <div key={i} className="relative w-full flex-shrink-0">
              <Image
                src={image}
                alt={post.title}
                height={270}
                width={600}
                priority
                className="absolute z-0 h-full w-full rounded-[20px] object-cover blur-sm"
              />
              <Image
                src={image}
                alt={post.title}
                height={270}
                width={600}
                priority
                className="absolute z-[1] h-full w-full rounded-[20px] object-contain"
              />
            </div>
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="absolute right-[10px] top-1/2 z-10 -translate-y-[50%] cursor-pointer rounded-full bg-[#241f2852] text-white"
        >
          <CircleArrowRight size={36} />
        </button>
      </div>
    </div>
  );
};

export default SliderPost;
