"use client";
import { IPaginator, IPost } from "@/types/Posts";
import ListPostTravel from "../listPostTravel/ListPostTravel";
import { Pagination } from "../pagination/Pagination";
import WidgetsPanel from "../widgetsPanel/WidgetsPanel";
import { ICategories, IPostCalendar } from "@/types/Travel";
import { useCallback, useEffect, useState } from "react";
import { ITag } from "@/types/Common";
import { sendDataToBackend } from "@/lib/api";

interface ITravelClientProps {
  data: IPost[];
  paginator: IPaginator;
  categories: ICategories | null;
  topThreePopular: IPost[];
  postsCalendar: IPostCalendar[];
  postsTags: ITag[];
}

const TravelClient: React.FC<ITravelClientProps> = ({
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

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const type = window.location.href;

    const userData = {
      userAgent,
      language,
      type,
    };

    sendDataToBackend(userData);
  }, []);

  return (
    <section className="float-right flex h-full flex-col xs:w-full lg:w-3/4">
      <div className="container mx-auto px-[15px] sm:w-[540px] md:w-[720px] lg:w-[960px] lg:max-w-full xl:w-[1140px]">
        <div className="flex flex-wrap xs:flex-col 2xl:flex-row">
          <div className="2xl:flex-basic-[66.6%] xs:flex-basic-[100%] flex w-full flex-shrink-0 flex-grow-0 flex-col xs:max-w-[100%] xs:px-0 xs:pt-8 lg:p-12 2xl:max-w-[66.6%]">
            <ListPostTravel
              data={data}
              isLoading={isLoading}
              setIsLoadingCallback={setIsLoadingCallback}
            />
            <Pagination paginator={paginator} type="travel" />
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

export default TravelClient;
