"use client";

import { useCallback, useEffect, useState } from "react";
import ListPostHome from "@/components/listPostHome/ListPostHome";
import { Pagination } from "@/components/pagination/Pagination";
import WidgetsPanel from "@/components/widgetsPanel/WidgetsPanel";
import { IPost, IPaginator } from "@/types/Posts";
import { ICategories, IPostCalendar } from "@/types/Travel";
import { ITag } from "@/types/Common";
import { sendDataToBackend } from "@/lib/clientApi";

interface IHomeClientProps {
  data: IPost[];
  paginator: IPaginator;
  categories: ICategories | null;
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
    <section className="flex min-h-screen w-full flex-col">
      <div className="mx-auto w-full max-w-[1280px] px-5 lg:px-8">
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_340px]">
          <main className="min-w-0 py-10">
            <ListPostHome
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

export default HomeClient;
