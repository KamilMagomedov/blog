import HomeClient from "@/components/homeClient/HomeClient";
import {
  fetchPosts,
  getCategories,
  getPostsCalendar,
  getTags,
} from "@/lib/api";
import { getPostQueryBuilder } from "@/lib/builder";
import { IGetPostQueryBuilder } from "@/types/Posts";

interface ISearchParams {
  page?: string;
  search?: string;
  tags?: string;
  archive?: string;
}

const Home: React.FC<{ searchParams: ISearchParams }> = async ({
  searchParams,
}) => {
  const params = await searchParams;
  const { page, search, tags, archive } = params;

  const postQueryBuilder: IGetPostQueryBuilder = getPostQueryBuilder()
    .setPage(page || "1")
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

// check code
// add function when user open my blog
//fix skeletonAbout
