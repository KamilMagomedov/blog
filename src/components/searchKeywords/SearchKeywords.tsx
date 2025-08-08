"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

interface SearchKeywordsProps {
  setIsLoadingCallback: (param: boolean) => void;
}
const SearchKeywords: React.FC<SearchKeywordsProps> = ({
  setIsLoadingCallback,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get("search") || "";
  const [inputValue, setInputValue] = useState(query);

  const updateSearchParams = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams || undefined);
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }

      if (params.toString() !== searchParams?.toString()) {
        setIsLoadingCallback(true);
        router.push(`?${params.toString()}`, { scroll: false });
      }
      console.log("params:", params.toString(), 1111);
    },
    [router, searchParams, setIsLoadingCallback],
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      updateSearchParams(inputValue);
    }, 500);

    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [inputValue, updateSearchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="mb-[40px]">
      <div className="relative mx-auto xs:w-[270px] md:w-[400px] 2xl:w-[270px]">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          className="h-[52px] w-full border bg-[white] py-[6px] pl-3 pr-[50px] text-sm text-[black] outline-black"
          placeholder="Type a keyword and hit enter"
        />
        <span className="absolute right-[15px] top-[19px] h-[15px] w-[15px]">
          <Search className="h-full w-full" />
        </span>
      </div>
    </div>
  );
};

export default SearchKeywords;
