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
    <div className="sidebar bg-[#f8f9fa] pt-12 text-[#212529] xs:w-full xs:max-w-[100%] 2xl:w-1/3 2xl:max-w-[33.333%] 2xl:flex-shrink-0 2xl:flex-grow-0">
      <SearchKeywords setIsLoadingCallback={setIsLoadingCallback} />
      <Categories categories={categories.data.categories} />
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
  );
};

export default WidgetsPanel;
