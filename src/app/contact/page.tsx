import ContactForm from "@/components/contactForm/ContactForm";
import ContactInformation from "@/components/contactInformation/ContactInformation";
import { getContactItems } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Kamil's Blog",
  description:
    "Get in touch with Kamil. Whether you have a project, a question, or just want to connect, feel free to reach out.",
  keywords: [
    "contact",
    "get in touch",
    "Kamil",
    "frontend developer",
    "web development",
    "hire a developer",
  ],
};

const ContactPage: React.FC = async () => {
  const contactData = await getContactItems();

  return (
    <section className="min-h-screen w-full lg:flex lg:items-center">
      <div className="mx-auto w-full max-w-[1100px] px-5 py-12 lg:px-8">
        <ContactInformation initialContacts={contactData?.data || []} />
        <ContactForm />
      </div>
    </section>
  );
};

export default ContactPage;
