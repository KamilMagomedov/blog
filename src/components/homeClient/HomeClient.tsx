"use client";

import { useCallback, useState } from "react";
import ListPostHome from "@/components/listPostHome/ListPostHome";
import { Pagination } from "@/components/pagination/Pagination";
import WidgetsPanel from "@/components/widgetsPanel/WidgetsPanel";
import { IPost, IPaginator } from "@/types/Posts";
import { ICategories, IPostCalendar } from "@/types/Travel";
import { ITag } from "@/types/Common";

interface IHomeClientProps {
  data: IPost[];
  paginator: IPaginator;
  categories: ICategories;
  topThreePopular: IPost[];
  postsCalendar: IPostCalendar[];
  postsTags: ITag[];
}

const HomeClient: React.FC<IHomeClientProps> = ({
  data,
  paginator,
  categories,
  topThreePopular,
  postsCalendar,
  postsTags,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const setIsLoadingCallback = useCallback((param: boolean) => {
    setIsLoading(param);
  }, []);

  return (
    <section className="float-right flex h-full flex-col xs:w-full lg:w-3/4">
      <div className="container mx-auto px-[15px] sm:w-[540px] md:w-[720px] lg:w-[960px] lg:max-w-full xl:w-[1140px]">
        <div className="flex flex-wrap xs:flex-col 2xl:flex-row">
          <div className="2xl:flex-basic-[66.6%] xs:flex-basic-[100%] flex-shrink-0 flex-grow-0 xs:w-[100%] xs:px-0 xs:pt-8 lg:p-12 2xl:w-[66.6%]">
            <ListPostHome
              data={data}
              isLoading={isLoading}
              setIsLoadingCallback={setIsLoadingCallback}
            />
            <Pagination paginator={paginator} type="/" />
          </div>
          <WidgetsPanel
            categories={categories}
            topThreePopular={topThreePopular}
            postsCalendar={postsCalendar}
            isLoading={isLoading}
            setIsLoadingCallback={setIsLoadingCallback}
            postsTags={postsTags}
          />
        </div>
      </div>
    </section>
  );
};

export default HomeClient;
