"use client";

import { CalendarRange, Heart, MessageCircleMore } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import CommentsCount from "../comments/CommentsCount";
import Image from "next/image";
import { IPost } from "@/types/Posts";
import { getPostImage } from "@/lib/getPostImages";
import { lora } from "@/styles/fonts";
import DevelopmentSkeleton from "@/app/development/ui/DevelopmentSkeleton";

interface IListPostDevelopmentProps {
  data: IPost[];
}
const ListPostDevelopment: React.FC<IListPostDevelopmentProps> = ({ data }) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (data !== null || data !== undefined) {
      setLoading(false);
    }
  }, [data]);

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
      { threshold: 0.1 },
    );

    postRefs.current.forEach((post) => {
      if (post) observer.observe(post);
    });

    return () => observer.disconnect();
  }, [data]);

  if (loading) {
    return <DevelopmentSkeleton />;
  }

  return (
    <ul className="flex flex-col px-[15px]">
      {data.map((post: IPost, index) => (
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
          className="mb-12 flex w-full items-center xs:mb-8 xs:flex-col lg:max-w-[100%] lg:flex-row"
        >
          <div className="relative block min-w-[150px] overflow-hidden rounded-[20px] xs:mb-4 xs:mr-0 lg:mb-0 lg:mr-4">
            <Link
              href={`/post/${post.id}`}
              className="block h-[150px] w-[150px]"
            >
              <Image
                src={getPostImage(post.image)}
                alt="My_photo"
                width={150}
                height={150}
                className="h-full bg-cover bg-center bg-no-repeat object-cover"
                style={{ color: "black" }}
                priority={true}
              />
            </Link>
          </div>
          <div className="xs:w-[100%]">
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
                    color="#bfbfbf"
                    className="mr-[10px]"
                  />{" "}
                  <span className="mr-[10px] text-sm text-[#bfbfbf]">
                    {post.published_at}
                  </span>
                </p>
                <span className="xs:mr-0 md:mr-[10px]">{post.type}</span>
                <div className="xs:row flex xs:items-center xs:align-middle">
                  <MessageCircleMore
                    size={14}
                    color="#bfbfbf"
                    className="mr-[10px]"
                  />
                  <CommentsCount count={post.comments_count || 0} />
                </div>
                <span className="flex items-center">
                  <Heart
                    fill="#bfbfbf"
                    color="#bfbfbf"
                    className="mr-[6px] h-[15px] w-[15px]"
                  />
                  {post.likes}
                </span>
              </div>
              <p
                className="mb-6 line-clamp-3 xs:mb-0"
                dangerouslySetInnerHTML={{
                  __html: post.description,
                }}
              ></p>
              <Link
                href={`/post/${post.id}`}
                className="relative mr-4 max-w-[82px] text-[#1eafed]"
              >
                Read More{" "}
                <span className="before:absolute before:right-[-15px] before:top-[15px] before:inline-block before:h-[2px] before:w-[9px] before:-rotate-45 before:bg-[#1eafed] before:content-[''] after:absolute after:right-[-15px] after:top-[10px] after:inline-block after:h-[2px] after:w-[9px] after:rotate-45 after:bg-[#1eafed] after:content-['']"></span>
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ListPostDevelopment;
