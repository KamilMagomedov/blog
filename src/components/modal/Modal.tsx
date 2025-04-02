"use client";

import { useModal } from "@/contexts/ModalContext";
import { X } from "lucide-react";

const Modal = () => {
  const { isOpen, closeModal } = useModal();

  if (!isOpen) return null;

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[400px] rounded-lg bg-white p-5 shadow-lg"
      >
        <button onClick={closeModal} className="absolute right-2 top-2">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold">
          Thanks for your comment, it will be published after moderation
        </h2>

        <button
          onClick={closeModal}
          className="mt-4 w-full rounded bg-blue-500 px-4 py-2 text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
