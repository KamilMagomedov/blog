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

  const selected = searchParams.get("tags")?.split(",") || [];

  const toggleTag = (tag: string) => {
    setIsLoadingCallback(true);
    const updatedTags = selected.includes(tag)
      ? selected.filter((item) => item !== tag)
      : [...selected, tag];

    const params = new URLSearchParams(searchParams);
    if (updatedTags.length > 0) {
      params.set("tags", updatedTags.join(","));
    } else {
      params.delete("tags");
    }

    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    setIsLoadingCallback(false);
  }, [searchParams, setIsLoadingCallback]);

  return (
    <div className="mb-[40px]">
      <div className="mx-auto xs:w-[270px] md:w-[400px] 2xl:w-[270px]">
        <h3
          className={`mb-[30px] text-xl italic ${lora.className} text-[#000c]`}
        >
          Tag Cloud
        </h3>
        <div className="flex">
          <p className="mr-6">
            {postsTags.map((tag) => (
              <span
                key={tag.id}
                onClick={() => !isLoading && toggleTag(tag.name)}
                className={`mb-[7px] mr-1 inline-block cursor-pointer rounded border border-solid px-[10px] py-1 text-[11px] text-[#000] hover:border-[#000c] ${
                  selected.includes(tag.name) ? "border-black bg-gray-200" : ""
                } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
              >
                {tag.slug.toUpperCase()}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TagCloud;
