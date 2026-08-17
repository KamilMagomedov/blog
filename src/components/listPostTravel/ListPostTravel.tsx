"use client";
import TravelSkeleton from "@/app/travel/ui/TravelSkeleton";
import { getPostImage } from "@/lib/getPostImages";
import { lora } from "@/styles/fonts";
import { IPost } from "@/types/Posts";
import { ArrowRight, EyeIcon, Heart, MessageCircleMore } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

interface IListPostTravelProps {
  data: IPost[] | undefined;
  isLoading: boolean;
  setIsLoadingCallback: (param: boolean) => void;
}
const ListPostTravel: React.FC<IListPostTravelProps> = ({
  data,
  isLoading,
  setIsLoadingCallback,
}) => {
  useEffect(() => {
    if (data) {
      setIsLoadingCallback(false);
    }
  }, [data, setIsLoadingCallback]);

  const postRefs = useRef<(HTMLLIElement | undefined | null)[]>([]);
  const [visiblePosts, setVisiblePosts] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const index = postRefs.current.findIndex(
            (ref) => ref === entry.target,
          );

          if (index === -1) return;

          setVisiblePosts((prev) => ({
            ...prev,
            [index]: true,
          }));

          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "30px",
        threshold: 0.1,
      },
    );

    postRefs.current.forEach((post) => {
      if (post) {
        observer.observe(post);
      }
    });

    return () => observer.disconnect();
  }, [data, isLoading]);

  if (isLoading) {
    return <TravelSkeleton />;
  }

  return (
    <ul className="flex flex-col">
      {data?.map((travel: IPost, index) => (
        <li
          key={travel.id}
          ref={(el) => {
            postRefs.current[index] = el;
          }}
          style={{
            opacity: visiblePosts[index] ? 1 : 0,
            transform: visiblePosts[index]
              ? "translateY(0)"
              : "translateY(20px)",
            transition: `opacity 0.5s ease-out, transform 0.5s ease-out ${index * 0.05}s`,
          }}
          className="group flex w-full max-w-[100%] flex-col items-center transition-all duration-300 ease-out hover:-translate-y-1 xs:mb-8 lg:mb-12"
        >
          <div className="relative block overflow-hidden rounded-[20px] xs:mb-4 lg:mb-6">
            <Link
              href={`/post/${travel.id}`}
              className="block w-auto xs:h-[260px] lg:h-[400px]"
            >
              <Image
                src={getPostImage(travel.image)}
                alt={travel.title}
                width={400}
                height={400}
                className="h-full bg-cover bg-center bg-no-repeat object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                priority
              />
            </Link>
          </div>
          <div className="w-full lg:px-[15px]">
            <h3
              className={`mb-6 text-left font-normal leading-6 text-gray-900 xs:text-[1.3rem] lg:text-3xl ${lora.className}`}
            >
              <Link
                href={`/post/${travel.id}`}
                className="transition-colors duration-300 hover:text-[#1eafed]"
              >
                {travel.title}
              </Link>
            </h3>
            <div className="flex xs:mb-4 xs:flex-col lg:mb-8">
              <p className="mb-6 line-clamp-5 overflow-hidden text-ellipsis">
                {travel.excerpt ?? ""}
              </p>
              <div className="flex">
                <Link
                  href={`/post/${travel.id}`}
                  className="mr-5 h-[60px] w-auto overflow-hidden rounded-[50%]"
                >
                  <Image
                    src={travel.author?.image ?? "/image_not_found.webp"}
                    alt="photo author"
                    width={60}
                    height={60}
                    className="h-full bg-cover bg-center bg-no-repeat object-cover"
                    style={{ color: "black" }}
                    priority
                  />
                </Link>
                <div className="text-base">
                  <span className="inline-block text-[#6c757d] xs:mb-[5px] lg:mb-[10px]">
                    Written by
                  </span>
                  <h3 className="text-black">
                    <Link href={`/about`} className="font-semibold underline">
                      {travel.author?.name},
                    </Link>{" "}
                    <span className="mr-[10px]">{travel.published_at}</span>
                  </h3>
                </div>
              </div>
            </div>
            <div className="flex justify-between xs:flex-col-reverse md:flex-row">
              <Link
                href={`/post/${travel.id}`}
                className="group/readmore relative mr-4 inline-flex items-center gap-2 rounded-[30px] bg-[#1eafed] px-6 py-4 text-white transition-transform duration-300 hover:-translate-y-0.5"
              >
                <span>Read More About Post</span>

                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover/readmore:translate-x-1"
                />
              </Link>

              <div className="flex xs:mb-[20px] xs:justify-center md:mb-0">
                <span className="mr-[10px] flex items-center">
                  <Heart fill="b3b3b3" className="mr-[6px] h-[15px] w-[15px]" />
                  {travel.likes ?? 0}
                </span>
                <span className="mr-[10px] flex items-center">
                  <EyeIcon className="mr-[6px] h-[15px] w-[15px]" />
                  {travel.views ?? 0}
                </span>
                <span className="flex items-center">
                  <MessageCircleMore
                    color="#6c757d"
                    className="mr-[6px] h-[15px] w-[15px]"
                  />
                  {travel.comments_count ?? 0}
                </span>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ListPostTravel;
