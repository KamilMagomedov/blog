"use client";
import React from "react";

interface PropsRelyComment {
  commentId: number;
  setCommentReply: (id: number) => void;
  setLeaveCommentUnderComment: (param: boolean) => void;
}

const ReplyComment: React.FC<PropsRelyComment> = ({
  commentId,
  setCommentReply,
  setLeaveCommentUnderComment,
}) => {
  const replyComment = () => {
    setCommentReply(commentId);
    setLeaveCommentUnderComment(true);
  };

  return (
    <button
      onClick={replyComment}
      className="-tracking-4 ease mb-4 rounded-sm bg-[#e6e6e6] px-[10px] py-[5px] text-[11px] uppercase text-black transition-all duration-300 hover:bg-black hover:text-white"
    >
      REPLY
    </button>
  );
};

export default ReplyComment;
