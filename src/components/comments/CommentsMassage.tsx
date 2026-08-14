"use client";
import React from "react";
import { IComment } from "@/types/Posts";
import Image from "next/image";
import ReplyComment from "./ReplyComment";
import CommentsForm from "./CommentsForm"; // 1. Импортируем форму

interface ICommentsProps {
  postId: number | string;
  comments: IComment[];
  commentReply: number | null;

  setCommentReply: React.Dispatch<React.SetStateAction<number | null>>;

  leaveCommentUnderComment: boolean;

  setLeaveCommentUnderComment: React.Dispatch<React.SetStateAction<boolean>>;
}

const CommentsMassage: React.FC<ICommentsProps> = ({
  postId,
  comments,
  commentReply,
  setCommentReply,
  leaveCommentUnderComment,
  setLeaveCommentUnderComment,
}) => {
  const renderComments = (items: IComment[]) => {
    if (!items || items.length === 0) return null;

    return items.map((comment) => {
      const formattedDate = comment.created_at
        ? new Date(comment.created_at).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "";

      return (
        <div key={comment.id} className="mb-6">
          <div className="flex gap-4">
            <div className="relative h-[50px] w-[50px] flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
              {comment.logo ? (
                <Image
                  src={comment.logo}
                  alt={comment.name}
                  fill
                  sizes="50px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-sky-500 font-bold text-white">
                  {comment.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h4 className="font-bold text-gray-900">{comment.name}</h4>
                <span className="text-xs text-gray-500">{formattedDate}</span>
              </div>
              <p className="mt-1 text-gray-700">{comment.comment}</p>

              <ReplyComment
                commentId={comment.id}
                setCommentReply={setCommentReply}
                setLeaveCommentUnderComment={setLeaveCommentUnderComment}
              />

              {commentReply === comment.id && (
                <div className="mt-4 border-l-2 border-sky-500 pl-4">
                  <CommentsForm
                    id={postId}
                    commentReply={commentReply}
                    setCommentReply={setCommentReply}
                    leaveCommentUnderComment={leaveCommentUnderComment}
                    setLeaveCommentUnderComment={setLeaveCommentUnderComment}
                  />
                </div>
              )}
            </div>
          </div>

          {comment.comments && comment.comments.length > 0 && (
            <div className="ml-8 mt-4 border-l-2 border-gray-200 pl-4">
              {renderComments(comment.comments)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="mb-8">
      <h3 className="mb-6 text-2xl font-bold text-black">
        Comments ({comments?.length || 0})
      </h3>
      {comments && comments.length > 0 ? (
        renderComments(comments)
      ) : (
        <p className="italic text-gray-500">No comments yet. Be the first!</p>
      )}
    </div>
  );
};

export default CommentsMassage;
