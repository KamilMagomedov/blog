"use client";
import { lora } from "@/styles/fonts";
import { ITag } from "@/types/Common";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

interface ITagCloudProps {
  isLoading: boolean;
  setIsLoadingCallback: (param: boolean) => void;
  postsTags: ITag[];
}

const TagCloud: React.FC<ITagCloudProps> = ({
  isLoading,
  setIsLoadingCallback,
  postsTags,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedTag = searchParams?.get("tags") || null;

  const showPostsByTag = (slug: string) => {
    setIsLoadingCallback(true);

    if (selectedTag === slug) {
      router.push("/");
      return;
    }

    router.push(`/?tags=${encodeURIComponent(slug)}&page=1`);
  };

  useEffect(() => {
    setIsLoadingCallback(false);
  }, [searchParams, setIsLoadingCallback]);

  return (
    <div className="mb-10">
      <div className="w-full min-w-0">
        <h3
          className={`mb-[30px] text-xl italic ${lora.className} text-[#000c]`}
        >
          Tag Cloud
        </h3>

        <div className="flex flex-wrap gap-2">
          {postsTags.map((tag) => {
            const slug = tag.slug || tag.name;

            return (
              <span
                key={tag.id}
                onClick={() => !isLoading && showPostsByTag(slug)}
                className={`mb-[7px] mr-1 inline-block cursor-pointer rounded border border-solid px-[10px] py-1 text-[11px] text-[#000] transition-colors hover:border-[#000c] ${
                  selectedTag === slug ? "border-black bg-gray-200" : ""
                } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
              >
                {(tag.name || slug).toUpperCase()}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TagCloud;
