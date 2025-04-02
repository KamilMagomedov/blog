import ListPostDevelopment from "@/components/listPostDevelopment/ListPostDevelopment";
import { Pagination } from "@/components/pagination/Pagination";
import { fetchPosts } from "@/lib/api";
import { getPostQueryBuilder } from "@/lib/builder";
import { IGetPostQueryBuilder } from "@/types/Posts";
import { Metadata } from "next";

interface ISearchParams {
  page?: string;
}

export const metadata: Metadata = {
  title: "Development Posts - Learn & Grow",
  description:
    "Stay updated with the latest development trends, coding best practices, and tech innovations.",
  keywords: ["development", "programming", "coding", "software", "technology"],
};

const DevelopmentPage = async ({
  searchParams,
}: {
  searchParams: ISearchParams;
}) => {
  const { page } = searchParams;
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
