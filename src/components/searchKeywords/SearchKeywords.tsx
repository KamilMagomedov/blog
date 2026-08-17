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
    <div className="mb-10">
      <div className="relative w-full min-w-0">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          className="h-[52px] w-full border bg-white py-[6px] pl-3 pr-[50px] text-sm text-black outline-black"
          placeholder="Search articles..."
        />

        <span className="absolute right-[15px] top-1/2 h-[15px] w-[15px] -translate-y-1/2">
          <Search className="h-full w-full" />
        </span>
      </div>
    </div>
  );
};

export default SearchKeywords;
