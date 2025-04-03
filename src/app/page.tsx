import HomeClient from "@/components/homeClient/HomeClient";
import {
  fetchPosts,
  getCategories,
  getPostsCalendar,
  getTags,
} from "@/lib/api";
import { getPostQueryBuilder } from "@/lib/builder";
import { IGetPostQueryBuilder } from "@/types/Posts";

type PageProps = {
  searchParams: Promise<{
    page?: string | string[];
    search?: string;
    tags?: string;
    archive?: string;
  }>;
};

const Home: React.FC<PageProps> = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams;
  const { page, search, tags, archive } = resolvedSearchParams;

  const currentPage = Array.isArray(page) ? page[0] : (page ?? "1");

  const postQueryBuilder: IGetPostQueryBuilder = getPostQueryBuilder()
    .setPage(currentPage)
    .setLimit(7)
    .setSearch(search || "")
    .setTags(tags || "")
    .setArchive(archive || "");

  const { data, paginator } = await fetchPosts(postQueryBuilder);

  const categories = await getCategories();
  const postsCalendar = await getPostsCalendar();
  const postsTags = await getTags();

  const mostPopularPostQueryBuilder: IGetPostQueryBuilder =
    getPostQueryBuilder().setLimit(3).setOrder("likes").setDir("desc");

  const { data: topThreePopular } = await fetchPosts(
    mostPopularPostQueryBuilder,
  );

  return (
    <HomeClient
      data={data}
      paginator={paginator}
      categories={categories}
      topThreePopular={topThreePopular}
      postsCalendar={postsCalendar}
      postsTags={postsTags}
    />
  );
};

export default Home;
