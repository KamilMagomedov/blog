"use client";
import React, { useState } from "react";
import CommentsMassage from "../comments/CommentsMassage";
import CommentsForm from "../comments/CommentsForm";
import { IComment } from "@/types/Posts";

interface IPropsClientCommentsComponent {
  comments: IComment[];
  id: number;
}
const ClientCommentsComponent: React.FC<IPropsClientCommentsComponent> = ({
  comments,
  id,
}) => {
  const [commentReply, setCommentReply] = useState<null | undefined | number>();
  const [leaveCommentUnderComment, setLeaveCommentUnderComment] =
    useState<boolean>(false);

  return (
    <>
      <CommentsMassage
        comments={comments}
        setCommentReply={setCommentReply}
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
