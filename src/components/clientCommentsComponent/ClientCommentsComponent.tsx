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
    <section className="mt-10 border-t border-gray-200 pt-10">
      <CommentsMassage
        postId={id}
        comments={comments}
        commentReply={commentReply}
        setCommentReply={setCommentReply}
        leaveCommentUnderComment={leaveCommentUnderComment}
        setLeaveCommentUnderComment={setLeaveCommentUnderComment}
      />

      <div className="mt-8">
        <CommentsForm
          id={id}
          commentReply={commentReply}
          comments={comments}
          leaveCommentUnderComment={leaveCommentUnderComment}
          setLeaveCommentUnderComment={setLeaveCommentUnderComment}
        />
      </div>
    </section>
  );
};

export default ClientCommentsComponent;
