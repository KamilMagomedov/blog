import AboutClient from "@/components/aboutClient/AboutClient";
import { getAuthorInformation } from "@/lib/api";
import { Author } from "@/types/AboutAuthorInfromation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About the Author | Kamil's Blog",
  description:
    "Learn more about Kamil, a passionate Frontend Developer & Tech Enthusiast. Discover his journey, skills, and experiences.",
  keywords: [
    "about author",
    "frontend developer",
    "tech enthusiast",
    "Kamil",
    "web development",
  ],
};

const AboutPage: React.FC = async () => {
  const aboutAuthorInform: Author = await getAuthorInformation();

  return <AboutClient aboutAuthorInform={aboutAuthorInform.data} />;
};

export default AboutPage;
