"use client";

import { IPost } from "@/types/Posts";
import { ICategories, IPostCalendar } from "@/types/Travel";
import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (categories && categories.data) {
      setLoading(false);
    }
  }, [categories?.data]);

  if (loading) {
    return <WidgetsPanelSkeleton />;
  }

  return (
    <div className="sidebar 2xl:flex-basic-[33.3%] xs:flex-basic-[100%] bg-[#f8f9fa] pt-12 xs:w-full xs:max-w-[100%] 2xl:w-1/3 2xl:max-w-[33.333%] 2xl:flex-shrink-0 2xl:flex-grow-0">
      <SearchKeywords setIsLoadingCallback={setIsLoadingCallback} />
      <Categories categories={categories && categories.data.categories} />
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
