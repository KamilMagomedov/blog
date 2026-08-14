"use client";

import React, { useState } from "react";
import CommentsMassage from "../comments/CommentsMassage";
import CommentsForm from "../comments/CommentsForm";
import { IComment } from "@/types/Posts";

interface IPropsClientCommentsComponent {
  comments: IComment[];
  id: number | string;
}

const ClientCommentsComponent: React.FC<IPropsClientCommentsComponent> = ({
  comments,
  id,
}) => {
  const [commentReply, setCommentReply] = useState<number | null>(null);

  const [leaveCommentUnderComment, setLeaveCommentUnderComment] =
    useState<boolean>(false);

  return (
    <>
      <CommentsMassage
        postId={id}
        comments={comments}
        commentReply={commentReply}
        setCommentReply={setCommentReply}
        leaveCommentUnderComment={leaveCommentUnderComment}
        setLeaveCommentUnderComment={setLeaveCommentUnderComment}
      />

      <CommentsForm
        id={id}
        commentReply={commentReply}
        comments={comments}
        leaveCommentUnderComment={leaveCommentUnderComment}
        setLeaveCommentUnderComment={setLeaveCommentUnderComment}
      />
    </>
  );
};

export default ClientCommentsComponent;
