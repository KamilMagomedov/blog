"use client";

import React, { useEffect, useRef, useState } from "react";
import SliderPost from "../sliderPost/SliderPost";
import LikeButton from "../likeButton/LikeButton";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { IPost } from "@/types/Posts";
import PostSkeleton from "./PostSkeleton";

interface IPostBodyProps {
  post: IPost;
}

const PostBody: React.FC<IPostBodyProps> = ({ post }) => {
  const [views, setViews] = useState<number>(post?.views || 0);
  const viewIncremented = useRef(false);

  useEffect(() => {
    if (viewIncremented.current || !post?.id) return;

    const viewedPosts: (string | number)[] = JSON.parse(
      sessionStorage.getItem("viewed_posts") || "[]",
    );

    if (!viewedPosts.includes(post.id)) {
      viewIncremented.current = true;

      fetch(`/api/posts/${post.id}/views`, { method: "POST" })
        .then((res) => {
          if (res.ok) {
            setViews((prev) => prev + 1);
            sessionStorage.setItem(
              "viewed_posts",
              JSON.stringify([...viewedPosts, post.id]),
            );
          }
        })
        .catch((err) => console.error("Failed to track view:", err));
    }
  }, [post?.id]);

  if (!post) {
    return <PostSkeleton />;
  }

  const articleContent = (
    post.content ||
    post.description ||
    post.excerpt ||
    ""
  )
    .replace(/!\[[\s\S]*?\]\([\s\S]*?\)/g, "")
    .replace(/  +/g, " ")
    .trim();

  return (
    <>
      <SliderPost post={post} />

      <h1 className="mb-2 text-3xl font-bold text-gray-900 xs:text-center lg:text-left">
        {post.title}
      </h1>
      <div className="flex items-center text-gray-600 xs:flex-col 2xl:mb-2 2xl:flex-row">
        <p className="text-sm xs:mb-2 2xl:mb-0 2xl:mr-[5px]">
          <span className="font-black text-black">Author: </span>
          <span>{post.author?.name || "Unknown"}</span>
        </p>
        <p className="text-sm xs:mb-2 2xl:mb-0 2xl:mr-[5px]">
          <span className="font-black text-black">Category: </span>{" "}
          <span>{post.category?.title || "Uncategorized"}</span>
        </p>
        <p className="text-sm xs:mb-2 2xl:mb-0 2xl:mr-[5px]">
          <span className="font-black text-black">Published: </span>{" "}
          <span>{post.published_at}</span>
        </p>
      </div>

      <div
        className="mb-6 break-words text-left text-gray-800 xs:text-[13px] md:text-lg [&_pre]:whitespace-pre-wrap"
        dangerouslySetInnerHTML={{
          __html: articleContent,
        }}
      />

      <div className="mb-6 flex items-center space-x-6 xs:justify-around 2xl:justify-start">
        <div className="flex items-center text-gray-600">
          <LikeButton initialLikes={post.likes || 0} id={post.id} />
        </div>
        <div className="flex items-center text-gray-600">
          <EyeIcon className="mr-2 h-5 w-5" /> {views} views
        </div>
      </div>

      <div className="mb-4">
        <Link
          href={`/${post.type}`}
          className="mb-[7px] mr-1 inline-block border border-solid border-[#6c757d] px-[10px] py-1 text-[11px] uppercase text-black"
        >
          {post.type}
        </Link>
      </div>

      <Link
        href={"/" + post.type}
        className="block w-[180px] rounded-lg bg-[#1eafed] px-5 py-2 text-white xs:mx-auto xs:mb-6 xs:mt-0 lg:-mx-0 2xl:mb-8"
      >
        ← Back to articles
      </Link>
    </>
  );
};

export default PostBody;
