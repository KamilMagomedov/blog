"use client";

import { IPost } from "@/types/Posts";
import { ICategories, IPostCalendar } from "@/types/Travel";
import WidgetsPanelSkeleton from "./WidgetsPanelSkeleton";
import TagCloud from "../tagCloud/TagCloud";
import Categories from "../categories/Categories";
import SearchKeywords from "../searchKeywords/SearchKeywords";
import PopularArticles from "../popularArticles/PopularArticles";
import Newsletter from "../newsletter/Newsletter";
import Archives from "../archives/Archives";
import { ITag } from "@/types/Common";

interface WidgetsPanelProps {
  categories: ICategories | null;
  topThreePopular: IPost[];
  postsCalendar: IPostCalendar[];
  isLoading: boolean;
  setIsLoadingCallback: (param: boolean) => void;
  postsTags: ITag[];
}

const WidgetsPanel: React.FC<WidgetsPanelProps> = ({
  categories,
  topThreePopular,
  postsCalendar,
  isLoading,
  setIsLoadingCallback,
  postsTags,
}) => {
  if (isLoading || !categories || !categories.data) {
    return <WidgetsPanelSkeleton />;
  }

  return (
    <aside className="sidebar min-w-0 self-stretch bg-[#f8f9fa] py-10 text-[#212529]">
      <div className="mx-auto w-full max-w-[520px] px-4 xl:max-w-[280px] xl:px-3">
        <SearchKeywords setIsLoadingCallback={setIsLoadingCallback} />

        <Categories categories={categories.data} />

        <PopularArticles topThreePopular={topThreePopular} />

        <TagCloud
          isLoading={isLoading}
          setIsLoadingCallback={setIsLoadingCallback}
          postsTags={postsTags}
        />

        <Newsletter />

        <Archives
          postsCalendar={postsCalendar}
          setIsLoadingCallback={setIsLoadingCallback}
        />
      </div>
    </aside>
  );
};

export default WidgetsPanel;
