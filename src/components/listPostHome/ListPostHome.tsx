"use client";
import { CalendarRange, Heart, MessageCircleMore } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import CommentsCount from "../comments/CommentsCount";
import Link from "next/link";
import Image from "next/image";
import { getPostImage } from "@/lib/getPostImages";
import { IPost } from "@/types/Posts";
import { lora } from "@/styles/fonts";
import DevelopmentSkeleton from "@/app/development/ui/DevelopmentSkeleton";
import ReadMoreLink from "../readMoreLink/ReadMoreLink";

interface ListPostHomeProps {
  data: IPost[];
  isLoading: boolean;
  setIsLoadingCallback: (param: boolean) => void;
}

const ListPostHome = ({
  data,
  isLoading,
  setIsLoadingCallback,
}: ListPostHomeProps) => {
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
    return <DevelopmentSkeleton />;
  }

  return (
    <ul className="flex flex-col gap-3">
      {data &&
        data.map((post: IPost, index) => {
          return (
            <li
              key={post.id}
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
              className="group mb-12 flex w-full transition-all duration-300 ease-out hover:-translate-y-1 xs:flex-col xs:items-center lg:flex-row lg:items-start lg:gap-5"
            >
              <div className="relative h-[150px] w-[150px] shrink-0 overflow-hidden rounded-[20px] xs:mb-4 lg:mb-0">
                <Link href={`/post/${post.id}`} className="block h-full w-full">
                  <Image
                    src={getPostImage(post.image)}
                    alt={post.title}
                    width={150}
                    height={150}
                    className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </Link>
              </div>
              <div className="min-w-0 flex-1">
                <h3
                  className={`mb-6 font-normal leading-6 text-gray-900 xs:text-center xs:text-[1.3rem] lg:text-left lg:text-3xl ${lora.className}`}
                >
                  <Link
                    href={`/post/${post.id}`}
                    className="transition-colors duration-300 hover:text-[#1eafed]"
                  >
                    {post.title}
                  </Link>
                </h3>
                <div className="flex xs:flex-col">
                  <div className="block_data_comments flex items-center xs:mb-0 xs:flex-col md:mx-auto md:my-0 md:flex-row lg:mx-0 lg:mb-6">
                    <p className="xs:row flex xs:items-center xs:align-middle">
                      <CalendarRange
                        size={14}
                        color="#6c757d"
                        className="mr-[10px]"
                      />{" "}
                      <span className="mr-[10px] text-sm text-[#6c757d]">
                        {post.published_at}
                      </span>
                    </p>
                    <span className="xs:mr-0 md:mr-[10px]">{post.type}</span>
                    <div className="xs:row mr-[10px] flex xs:items-center xs:align-middle">
                      <MessageCircleMore
                        size={14}
                        color="#6c757d"
                        className="mr-[10px]"
                      />
                      <CommentsCount count={post.comments_count ?? 0} />
                    </div>
                    <span className="flex items-center">
                      <Heart
                        fill="#6c757d"
                        color="#6c757d"
                        className="mr-[6px] h-[15px] w-[15px]"
                      />
                      {post.likes}
                    </span>
                  </div>
                  <p className="mb-6 line-clamp-2 xs:mb-0">
                    {post.excerpt ?? ""}
                  </p>
                  <ReadMoreLink postId={post.id} />
                </div>
              </div>
            </li>
          );
        })}
    </ul>
  );
};

export default ListPostHome;
