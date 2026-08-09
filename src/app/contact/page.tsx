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
  console.log(contactData, 3333);
  return (
    <section className="float-right flex overflow-auto px-6 py-20 xs:w-full xs:flex-col lg:w-3/4 xl:flex-row">
      <div className="md:m-w-[960px] mx-auto h-full w-full xs:max-w-[540px] xs:flex-col xs:p-0 sm:max-w-[720px] sm:px-[15px] lg:mb-12 lg:max-w-[1140px]">
        <ContactInformation initialContacts={contactData?.data || []} />
        <ContactForm />
      </div>
    </section>
  );
};

export default ContactPage;
