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

      <h1 className="mb-5 text-3xl font-bold leading-tight text-gray-900 xs:text-center lg:text-left">
        {post.title}
      </h1>

      <div className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-600">
        <p className="text-sm">
          <span className="font-black text-black">Author: </span>
          <span>{post.author?.name || "Unknown"}</span>
        </p>

        <p className="text-sm">
          <span className="font-black text-black">Category: </span>
          <span>{post.category?.title || "Uncategorized"}</span>
        </p>

        <p className="text-sm">
          <span className="font-black text-black">Published: </span>
          <span>{post.published_at}</span>
        </p>
      </div>

      <article
        className="mb-10 break-words text-left text-base leading-7 text-gray-700 md:text-lg md:leading-8 [&_a]:text-[#1eafed] [&_a]:underline-offset-4 hover:[&_a]:underline [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:text-gray-900 [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900 [&_li]:mb-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-7 [&_p]:mb-5 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_pre]:rounded-lg [&_pre]:bg-gray-100 [&_pre]:p-4 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-7"
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
