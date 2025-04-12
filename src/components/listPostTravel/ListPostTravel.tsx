"use client";
import TravelSkeleton from "@/app/travel/ui/TravelSkeleton";
import { getPostImage } from "@/lib/getPostImages";
import { lora } from "@/styles/fonts";
import { IPost } from "@/types/Posts";
import { EyeIcon, Heart, MessageCircleMore } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

interface IListPostTravelProps {
  data: IPost[];
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

  const [visiblePosts, setVisiblePosts] = useState<{ [key: number]: boolean }>(
    () => {
      const initial: { [key: number]: boolean } = {};
      for (let i = 0; i < 2; i++) initial[i] = true;
      return initial;
    },
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = postRefs.current.findIndex(
              (ref) => ref === entry.target,
            );
            if (index !== -1) {
              setVisiblePosts((prev) => ({ ...prev, [index]: true }));
            }
          }
        });
      },
      { threshold: 0.1 },
    );

    postRefs.current.forEach((post) => {
      if (post) observer.observe(post);
    });

    return () => observer.disconnect();
  }, [data]);

  if (isLoading) {
    return <TravelSkeleton />;
  }

  return (
    <ul className="flex flex-col">
      {data &&
        data.map((travel: IPost, index) => (
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
            className="flex w-full max-w-[100%] flex-col items-center xs:mb-8 lg:mb-12"
          >
            <div className="relative block overflow-hidden rounded-[20px] xs:mb-4 lg:mb-6">
              <Link
                href={`/post/${travel.id}`}
                className="block w-auto xs:h-[260px] lg:h-[400px]"
              >
                <Image
                  src={getPostImage(travel.image)}
                  alt="photo travel"
                  width={400}
                  height={400}
                  className="h-full bg-cover bg-center bg-no-repeat object-cover"
                  style={{ color: "black" }}
                  priority
                />
              </Link>
            </div>
            <div className="w-full lg:px-[15px]">
              <h3
                className={`mb-6 text-left font-normal leading-6 text-gray-900 xs:text-[1.3rem] lg:text-3xl ${lora.className}`}
              >
                <Link href={`/post/${travel.id}`}>{travel.title}</Link>
              </h3>
              <div className="flex xs:mb-4 xs:flex-col lg:mb-8">
                <p
                  className="mb-6 line-clamp-5 overflow-hidden text-ellipsis"
                  dangerouslySetInnerHTML={{
                    __html: travel.description,
                  }}
                ></p>
                <div className="flex">
                  <Link
                    href={`/post/${travel.id}`}
                    className="mr-5 h-[60px] w-auto overflow-hidden rounded-[50%]"
                  >
                    <Image
                      src={travel.author.image ?? "/image_not_found.webp"}
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
                        {travel.author.name},
                      </Link>{" "}
                      <span className="mr-[10px]">{travel.published_at}</span>
                    </h3>
                  </div>
                </div>
              </div>
              <div className="flex justify-between xs:flex-col-reverse md:flex-row">
                <Link
                  href={`/post/${travel.id}`}
                  className="relative mr-4 rounded-[30px] bg-[#1eafed] px-6 py-4 text-[#fff] xs:mx-auto md:mx-0"
                >
                  Read More About Post
                </Link>

                <div className="flex xs:mb-[20px] xs:justify-center md:mb-0">
                  <span className="mr-[10px] flex items-center">
                    <Heart
                      fill="b3b3b3"
                      className="mr-[6px] h-[15px] w-[15px]"
                    />
                    {travel.likes}
                  </span>
                  <span className="mr-[10px] flex items-center">
                    <EyeIcon className="mr-[6px] h-[15px] w-[15px]" />
                    {travel.views || 0}
                  </span>
                  <span className="flex items-center">
                    <MessageCircleMore
                      color="#6c757d"
                      className="mr-[6px] h-[15px] w-[15px]"
                    />
                    {travel.comments_count}
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
