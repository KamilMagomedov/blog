"use client";
import { useModal } from "@/contexts/ModalContext";
import { IComment } from "@/types/Posts";
import { useRef, useState } from "react";
import { X } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
interface ICommentsForm {
  name: string;
  email: string;
  comment: string;
  logo?: File | undefined;
  parent_id?: null | number | undefined;
}

interface ICommentsFormProps {
  id: number;
  commentReply: null | undefined | number;
  comments: IComment[];
  leaveCommentUnderComment: boolean;
  setLeaveCommentUnderComment: (param: boolean) => void;
}

const CommentsForm: React.FC<ICommentsFormProps> = ({
  id,
  commentReply,
  comments,
  leaveCommentUnderComment,
  setLeaveCommentUnderComment,
}) => {
  const [formData, setFormData] = useState<ICommentsForm>({
    name: "",
    email: "",
    comment: "",
    logo: undefined,
    parent_id: commentReply,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { openModal } = useModal();
  const formElem = useRef<HTMLFormElement | null>(null);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);

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
      const response = await fetch(`${API_URL}/v1/blog/posts/${id}/comments`, {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send message");
      }

      setSuccessMessage(
        "Thank you for reaching out! I'll get back to you soon.",
      );
      setFormData({
        name: "",
        email: "",
        comment: "",
        logo: undefined,
        parent_id: undefined,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setLeaveCommentUnderComment(false);
      openModal();
    } catch (error) {
      console.error("Error sending message:", error);
      setSuccessMessage(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {leaveCommentUnderComment && commentReply !== null && (
        <div className="relative mb-4 rounded-lg border border-gray-300 bg-gray-100 p-3 text-sm text-gray-700">
          <p>
            <strong>Replying to:</strong>{" "}
            {comments.find((c) => c.id === commentReply)?.comment}
          </p>
          <button
            onClick={() => {
              setLeaveCommentUnderComment(false);
              setFormData((prev) => ({ ...prev, parent_id: undefined }));
            }}
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
          <button
            onClick={() => {
              setLeaveCommentUnderComment(false);
              setFormData((prev) => ({ ...prev, parent_id: undefined }));
            }}
            className="mt-2 rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
          >
            Cancel reply
          </button>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        ref={formElem}
        className="mx-auto max-w-3xl rounded bg-[#f8f9fa] xs:p-[10px] lg:p-12"
      >
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
          className="mb-4 w-full rounded border-gray-300 p-2"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          required
          className="mb-4 w-full rounded border-gray-300 p-2"
        />

        <input
          ref={fileInputRef}
          type="file"
          name="logo"
          accept="image/*"
          onChange={handleFileUpload}
          className="mb-4 w-full rounded border-gray-300 p-2"
        />

        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          placeholder="Comment"
          required
          rows={4}
          className="mb-4 w-full rounded border-gray-300 p-2 text-black"
        ></textarea>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-[30px] border-[1px] border-solid border-[#1eafed] bg-[#1eafed] px-12 py-4 text-white transition-colors duration-500 ease-in-out hover:bg-transparent hover:text-[#1eafed] xs:mx-auto xs:my-0 xs:block xs:w-[208px]"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
        {successMessage && (
          <p className="mt-4 text-center text-sm text-green-600">
            {successMessage}
          </p>
        )}
      </form>
    </>
  );
};

export default CommentsForm;
