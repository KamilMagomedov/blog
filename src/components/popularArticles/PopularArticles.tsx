import { getPostImage } from "@/lib/getPostImages";
import { lora } from "@/styles/fonts";
import { IPost } from "@/types/Posts";
import { CalendarDays, MessageSquareText, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ITopThreePopular {
  topThreePopular: IPost[];
}
const PopularArticles: React.FC<ITopThreePopular> = ({ topThreePopular }) => {
  return (
    <div className="mb-[40px]">
      <div className="mx-auto xs:w-[270px] md:w-[400px] 2xl:w-[270px]">
        <h3
          className={`mb-[30px] text-xl italic ${lora.className} text-[#000c]`}
        >
          Popular Articles
        </h3>
        <div className="flex">
          <ul>
            {topThreePopular.map((popular) => (
              <li key={popular.id} className="mb-6 flex">
                <Link
                  href={`/post/${popular.id}`}
                  className={`relative mr-5 h-[80px] w-[80px] flex-shrink-0 flex-grow-0 basis-[80px]`}
                >
                  <Image
                    src={getPostImage(popular.image)}
                    alt="image"
                    fill
                    sizes="80px"
                    className="rounded-[20px] object-cover"
                    priority
                  />
                </Link>
                <div className="[w-calc(100%-100px)] mb-6">
                  <h3 className="mb-2 line-clamp-2 overflow-hidden text-ellipsis text-base text-[black]">
                    <Link href={`/post/${popular.id}`}>{popular.title}</Link>
                  </h3>
                  <div className="mb-1 flex items-center">
                    <CalendarDays className="mr-1 h-3 w-3 flex-shrink-0 text-[#808080]" />
                    <span className="text-xs text-[gray]">
                      {popular.published_at}
                    </span>
                  </div>
                  <div className="mb-1 flex items-center">
                    <UserRound className="mr-1 h-3 w-3 flex-shrink-0 text-[#808080]" />
                    <span className="line-clamp-1 max-w-[158px] overflow-hidden text-ellipsis text-xs text-[gray]">
                      <Link href="/about">{popular.author.name}</Link>
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquareText className="mr-1 h-3 w-3 flex-shrink-0 text-[#808080]" />
                    <span className="text-xs text-[gray]">
                      {popular.comments_count}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PopularArticles;
