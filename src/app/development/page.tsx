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
    <section className="float-right flex h-full flex-col py-20 xs:w-full lg:w-3/4">
      <div className="container mx-auto px-[15px] sm:w-[540px] md:w-[720px] lg:w-[960px] lg:max-w-full xl:w-[1140px]">
        <ListPostDevelopment data={data} />
      </div>
      <Pagination paginator={paginator} type="development" />
    </section>
  );
};

export default DevelopmentPage;
