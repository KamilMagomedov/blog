import { getAuthorInformation } from "@/lib/api";
import { Data } from "@/types/AboutAuthorInfromation";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

const AboutClient = dynamic(
  () => import("@/components/aboutClient/AboutClient"),
);

export const metadata: Metadata = {
  title: "About the Author | Kamil's Blog",
  description:
    "Learn more about Kamil Mahomedov, a Frontend Developer based in London, his professional experience and personal projects.",
  keywords: [
    "Kamil Mahomedov",
    "frontend developer",
    "React developer",
    "Next.js developer",
    "London",
    "web development",
  ],
};

const AboutPage: React.FC = async () => {
  const aboutAuthorInform: Data | null = await getAuthorInformation();

  return <AboutClient aboutAuthorInform={aboutAuthorInform} />;
};

export default AboutPage;
