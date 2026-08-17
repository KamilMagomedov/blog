"use client";
import { IPaginator, IPost } from "@/types/Posts";
import ListPostTravel from "../listPostTravel/ListPostTravel";
import { Pagination } from "../pagination/Pagination";
import WidgetsPanel from "../widgetsPanel/WidgetsPanel";
import { ICategories, IPostCalendar } from "@/types/Travel";
import { useCallback, useEffect, useState } from "react";
import { ITag } from "@/types/Common";
import { sendDataToBackend } from "@/lib/clientApi";

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
    <section className="min-h-screen w-full">
      <div className="mx-auto w-full max-w-[1280px] px-5 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-10 xl:grid-cols-[minmax(0,1fr)_340px]">
          <main className="min-w-0 py-10">
            <ListPostTravel
              data={data}
              isLoading={isLoading}
              setIsLoadingCallback={setIsLoadingCallback}
            />

            <Pagination paginator={paginator} />
          </main>

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
