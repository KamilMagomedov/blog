import TravelClient from "@/components/travelClient/TravelClient";
import {
  fetchPosts,
  getCategories,
  getPostsCalendar,
  getTags,
} from "@/lib/api";
import { getPostQueryBuilder } from "@/lib/builder";
import { IGetPostQueryBuilder } from "@/types/Posts";
import { Metadata } from "next";

interface ISearchParams {
  page?: string;
  search?: string;
  tags?: string;
}

interface PageProps {
  searchParams: Promise<ISearchParams>;
}

export const metadata: Metadata = {
  title: "Travel Posts - Explore the World",
  description:
    "Discover the best travel destinations, tips, and experiences from our latest travel blog posts.",
  keywords: ["travel", "tourism", "destinations", "adventure", "travel tips"],
};

const TravelPage = async ({ searchParams }: PageProps) => {
  const { page, search, tags } = await searchParams;

  const postQueryBuilder: IGetPostQueryBuilder = getPostQueryBuilder()
    .setPage(page || "1")
    .setLimit(7)
    .setType("travel")
    .setSearch(search || "")
    .setTags(tags || "");

  const { data, paginator } = await fetchPosts(postQueryBuilder);

  const categories = await getCategories();
  const postsCalendar = await getPostsCalendar();
  const postsTags = await getTags("travel");

  const mostPopularPostQueryBuilder: IGetPostQueryBuilder =
    getPostQueryBuilder()
      .setLimit(3)
      .setOrder("likes")
      .setDir("desc")
      .setType("travel");

  const { data: topThreePopular } = await fetchPosts(
    mostPopularPostQueryBuilder,
  );

  return (
    <TravelClient
      data={data}
      paginator={paginator}
      categories={categories}
      postsCalendar={postsCalendar}
      topThreePopular={topThreePopular}
      postsTags={postsTags}
    />
  );
};

export default TravelPage;
