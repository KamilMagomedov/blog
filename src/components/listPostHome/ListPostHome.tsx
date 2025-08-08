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

  const [visiblePosts, setVisiblePosts] = useState<{ [key: number]: boolean }>(
    () => {
      const initial: { [key: number]: boolean } = {};
      for (let i = 0; i < 5; i++) initial[i] = true;
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
      { rootMargin: "30px", threshold: 0.1 },
    );

    postRefs.current.forEach((post) => {
      if (post) observer.observe(post);
    });

    return () => observer.disconnect();
  }, [data]);

  if (isLoading) {
    return <DevelopmentSkeleton />;
  }

  return (
    <ul className="flex flex-col">
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
              className="mb-12 flex w-full items-center xs:mb-8 xs:flex-col lg:max-w-[90%] lg:flex-row"
            >
              <div className="relative block min-w-[150px] overflow-hidden rounded-[20px] xs:mb-4 xs:mr-0 lg:mb-0 lg:mr-4">
                <Link
                  href={`/post/${post.id}`}
                  className="inline-block h-[150px] w-[150px]"
                >
                  <Image
                    src={getPostImage(post.image)}
                    alt="My photo"
                    width={150}
                    height={150}
                    className="h-full object-cover object-center"
                    priority={true}
                  />
                </Link>
              </div>
              <div className="w-[100%]">
                <h3
                  className={`mb-6 font-normal leading-6 text-gray-900 xs:text-center xs:text-[1.3rem] lg:text-left lg:text-3xl ${lora.className}`}
                >
                  <Link href={`/post/${post.id}`}>{post.title}</Link>
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
                      <CommentsCount count={post.comments_count || 0} />
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
                  <p
                    className="mb-6 line-clamp-2 xs:mb-0"
                    dangerouslySetInnerHTML={{
                      __html: post.description,
                    }}
                  ></p>
                  <Link
                    href={`/post/${post.id}`}
                    className="relative mr-4 max-w-[165px] text-[#1eafed]"
                  >
                    Read More About Post{" "}
                    <span className="before:absolute before:right-[-15px] before:top-[15px] before:inline-block before:h-[2px] before:w-[9px] before:-rotate-45 before:bg-[#1eafed] before:content-[''] after:absolute after:right-[-15px] after:top-[10px] after:inline-block after:h-[2px] after:w-[9px] after:rotate-45 after:bg-[#1eafed] after:content-['']"></span>
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
    </ul>
  );
};

export default ListPostHome;
