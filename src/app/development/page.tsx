import { type Metadata } from "next";
import dynamic from "next/dynamic";
import { fetchPosts } from "@/lib/api";
import { getPostQueryBuilder } from "@/lib/builder";
import { IGetPostQueryBuilder } from "@/types/Posts";
import { Pagination } from "@/components/pagination/Pagination";

const ListPostDevelopment = dynamic(
  () => import("@/components/listPostDevelopment/ListPostDevelopment"),
);

type PageProps = {
  searchParams: Promise<{
    page?: string | undefined;
  }>;
};

export const metadata: Metadata = {
  title: "Development Posts - Learn & Grow",
  description:
    "Stay updated with the latest development trends, coding best practices, and tech innovations.",
  keywords: ["development", "programming", "coding", "software", "technology"],
};

export const revalidate = 3600;

const DevelopmentPage = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page || "1";

  const postQueryBuilder: IGetPostQueryBuilder = getPostQueryBuilder()
    .setPage(page)
    .setLimit(7)
    .setType("development");

  const { data, paginator } = await fetchPosts(postQueryBuilder);

  return (
    <section className="min-h-screen w-full">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-10 lg:px-8">
        <div className="mx-auto w-full max-w-[1000px]">
          <ListPostDevelopment data={data} />

          <Pagination paginator={paginator} />
        </div>
      </div>
    </section>
  );
};

export default DevelopmentPage;
