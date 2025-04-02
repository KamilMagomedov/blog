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

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSuccessMessage(
        "Thank you for reaching out! I'll get back to you soon.",
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setSuccessMessage(null);
    } finally {
      setIsSubmitting(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }
  };

  return (
    <div className="h-full">
      <form
        onSubmit={handleSubmit}
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
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Subject"
          required
          className="mb-4 w-full rounded border-gray-300 p-2"
        />

        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Message"
          required
          rows={4}
          className="mb-4 w-full rounded border-gray-300 p-2"
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
    </div>
  );
};

export default ContactForm;
