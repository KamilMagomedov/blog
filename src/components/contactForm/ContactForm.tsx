"use client";
import { useState } from "react";

interface IContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}
const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<IContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      setSuccessMessage(
        data.message || "Thank you! I'll get back to you soon.",
      );

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);

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
    <div className="h-full">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-[900px] rounded-lg bg-[#f8f9fa] p-6 lg:p-10"
      >
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
          className="mb-4 w-full rounded border border-gray-300 bg-white px-4 py-3 outline-none transition-colors focus:border-[#1eafed]"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          required
          className="mb-4 w-full rounded border border-gray-300 bg-white px-4 py-3 outline-none transition-colors focus:border-[#1eafed]"
        />

        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Subject"
          required
          className="mb-4 w-full rounded border border-gray-300 bg-white px-4 py-3 outline-none transition-colors focus:border-[#1eafed]"
        />

        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Message"
          required
          rows={4}
          className="mb-4 w-full rounded border border-gray-300 bg-white px-4 py-3 outline-none transition-colors focus:border-[#1eafed]"
        ></textarea>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-[30px] border border-[#1eafed] bg-[#1eafed] px-12 py-4 text-white transition-colors duration-300 hover:bg-transparent hover:text-[#1eafed] disabled:cursor-not-allowed disabled:opacity-50 xs:mx-auto xs:block xs:w-[208px]"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>

        {successMessage && (
          <p className="mt-4 text-center text-sm text-green-600">
            {successMessage}
          </p>
        )}

        {errorMessage && (
          <p className="mt-4 text-center text-sm text-red-600">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
