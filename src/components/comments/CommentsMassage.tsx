"use client";
import { getPostImage } from "@/lib/getPostImages";
import { IComment } from "@/types/Posts";
import Image from "next/image";
import ReplyComment from "./ReplyComment";
import { useEffect, useState } from "react";
import CommentsMassageSkeleton from "./CommentsMassageSkeleton";

interface ICommentsProps {
  comments: IComment[];
  setCommentReply: (id: number | null) => void;
  setLeaveCommentUnderComment: (param: boolean) => void;
}

const CommentsMassage: React.FC<ICommentsProps> = ({
  comments,
  setCommentReply,
  setLeaveCommentUnderComment,
}) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (comments !== null || comments !== undefined) {
      setLoading(false);
    }
  }, [comments]);

  if (loading) {
    return <CommentsMassageSkeleton />;
  }

  const renderComments = (comments: IComment[] | null) => {
    return comments?.map((comment) => {
      const uppercaseFirstLetter =
        comment.name.charAt(0).toUpperCase() + comment.name.slice(1);

      return (
        <div key={comment.id}>
          <div className="flex">
            <div className="flex items-start justify-center xs:mr-0 xs:w-[50px] md:mr-[30px] md:w-[100px]">
              <Image
                width={75}
                height={75}
                src={getPostImage(comment.logo)}
                alt={comment.name}
                priority
                className="rounded-[20px] object-cover xs:h-[40px] xs:w-[40px] md:h-[75px] md:w-[75px]"
              />
            </div>
            <div>
              <h3 className="font-normal text-[#000c] xs:text-base md:text-xl">
                {uppercaseFirstLetter}
              </h3>
              <p className="-tracking-4 text-[13px] uppercase text-[#ccc]">
                {comment.created_at}
              </p>
              <p>{comment.comment}</p>
              <ReplyComment
                commentId={comment.id}
                setCommentReply={setCommentReply}
                setLeaveCommentUnderComment={setLeaveCommentUnderComment}
              />
            </div>
          </div>
          {comment.comments && comment.comments.length > 0 && (
            <div className="ml-6 border-l pl-4">
              {renderComments(comment.comments)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div>
      <h3 className="mb-12 text-[1.75rem] font-black text-black">Comments</h3>
      <ul>{renderComments(comments)}</ul>
    </div>
  );
};

export default CommentsMassage;
