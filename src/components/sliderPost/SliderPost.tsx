"use client";

import { IPost } from "@/types/Posts";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface ISliderPostsProps {
  post: IPost;
}

const SliderPost: React.FC<ISliderPostsProps> = ({ post }) => {
  const images = post.images ?? [];

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(1);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true);

  const extendedImages =
    images.length > 0 ? [images[images.length - 1], ...images, images[0]] : [];

  useEffect(() => {
    if (extendedImages.length === 0) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    if (currentImageIndex === extendedImages.length - 1) {
      timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentImageIndex(1);
      }, 300);
    } else if (currentImageIndex === 0) {
      timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentImageIndex(extendedImages.length - 2);
      }, 300);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [currentImageIndex, extendedImages.length]);

  useEffect(() => {
    if (isTransitioning) return;

    const timer = setTimeout(() => {
      setIsTransitioning(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [isTransitioning]);

  const nextSlide = () => {
    setIsTransitioning(true);
    setCurrentImageIndex((prevIndex) => prevIndex + 1);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setCurrentImageIndex((prevIndex) => prevIndex - 1);
  };

  if (images.length === 0) {
    return (
      <div className="mb-8 flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-gray-200 text-gray-500">
        No image
      </div>
    );
  }

  return (
    <div className="relative mb-8 w-full overflow-hidden rounded-xl bg-gray-200">
      <div className="relative aspect-video w-full">
        {images.length > 1 && (
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 text-white transition-colors duration-300 hover:bg-black/70"
          >
            <CircleArrowLeft size={36} />
          </button>
        )}

        <div
          className={`flex h-full w-full ${
            isTransitioning
              ? "transition-transform duration-300 ease-in-out"
              : ""
          }`}
          style={{
            transform: `translateX(-${currentImageIndex * 100}%)`,
          }}
        >
          {extendedImages.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="relative h-full w-full shrink-0"
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 900px"
                className="scale-110 object-cover blur-xl"
                aria-hidden="true"
              />

              <Image
                src={image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 900px"
                priority={index === 1}
                className="relative z-10 object-contain"
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next image"
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 text-white transition-colors duration-300 hover:bg-black/70"
          >
            <CircleArrowRight size={36} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SliderPost;
