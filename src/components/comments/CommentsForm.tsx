"use client";
import { useModal } from "@/contexts/ModalContext";
import { IComment } from "@/types/Posts";
import { useRef, useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface ICommentsForm {
  name: string;
  email: string;
  comment: string;
  logo?: File;
}

interface ICommentsFormProps {
  id: number | string;
  commentReply?: null | number;
  setCommentReply?: (id: number | null) => void;
  comments?: IComment[];
  leaveCommentUnderComment?: boolean;
  setLeaveCommentUnderComment: (param: boolean) => void;
}

const CommentsForm: React.FC<ICommentsFormProps> = ({
  id,
  commentReply,
  setCommentReply,
  comments = [],
  leaveCommentUnderComment,
  setLeaveCommentUnderComment,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<ICommentsForm>({
    name: "",
    email: "",
    comment: "",
    logo: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { openModal } = useModal();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }));
    }
  };

  const handleCancelReply = () => {
    setLeaveCommentUnderComment(false);
    if (setCommentReply) setCommentReply(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("comment", formData.comment);
    if (formData.logo) {
      formDataToSend.append("logo", formData.logo);
    }
    if (commentReply) {
      formDataToSend.append("parent_id", commentReply.toString());
    }

    try {
      const response = await fetch(`/api/v1/blog/posts/${id}/comments`, {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send message");
      }

      setFormData({
        name: "",
        email: "",
        comment: "",
        logo: undefined,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setLeaveCommentUnderComment(false);
      if (setCommentReply) setCommentReply(null);

      openModal();
      router.refresh();
    } catch (error) {
      console.error("Error sending comment:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {leaveCommentUnderComment &&
        commentReply !== null &&
        commentReply !== undefined && (
          <div className="relative mb-5 rounded-lg border border-[#1eafed]/20 bg-sky-50 p-4 pr-12 text-sm text-gray-700">
            <p className="font-medium text-gray-900">Replying to comment</p>

            <p className="mt-1 line-clamp-2">
              {comments.find((c) => c.id === commentReply)?.comment ||
                `Comment #${commentReply}`}
            </p>

            <button
              type="button"
              onClick={handleCancelReply}
              aria-label="Cancel reply"
              className="absolute right-3 top-3 text-gray-400 transition-colors hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        )}
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-xl bg-[#f8f9fa] p-5 md:p-8"
      >
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="comment-name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Name
            </label>

            <input
              id="comment-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black outline-none transition-colors duration-200 focus:border-[#1eafed]"
            />
          </div>

          <div>
            <label
              htmlFor="comment-email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="comment-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black outline-none transition-colors duration-200 focus:border-[#1eafed]"
            />
          </div>
        </div>

        <div className="mb-4">
          <span className="mb-2 block text-sm font-medium text-gray-700">
            Avatar
            <span className="ml-1 font-normal text-gray-400">(optional)</span>
          </span>

          <input
            ref={fileInputRef}
            id={`comment-avatar-${commentReply ?? "main"}`}
            type="file"
            name="logo"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileUpload}
            className="sr-only"
          />

          <label
            htmlFor={`comment-avatar-${commentReply ?? "main"}`}
            className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-dashed border-gray-300 bg-white px-4 py-3 text-sm text-gray-600 transition-colors duration-200 hover:border-[#1eafed] hover:text-[#1eafed]"
          >
            <span className="truncate">
              {formData.logo ? formData.logo.name : "Choose profile image"}
            </span>

            <span className="shrink-0 text-xs text-gray-400">
              JPG, PNG, WEBP
            </span>
          </label>
        </div>

        <div className="mb-6">
          <label
            htmlFor={`comment-text-${commentReply ?? "main"}`}
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Comment
          </label>

          <textarea
            id={`comment-text-${commentReply ?? "main"}`}
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder={
              commentReply ? "Write your reply..." : "Share your thoughts..."
            }
            required
            rows={5}
            className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-black outline-none transition-colors duration-200 focus:border-[#1eafed]"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full border border-[#1eafed] bg-[#1eafed] px-8 py-3 font-medium text-white transition-all duration-300 hover:bg-transparent hover:text-[#1eafed] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Posting..."
              : commentReply
                ? "Post reply"
                : "Post comment"}
          </button>
        </div>

        {errorMessage && (
          <p className="mt-4 text-center text-sm text-red-600">
            {errorMessage}
          </p>
        )}
      </form>
    </>
  );
};

export default CommentsForm;
