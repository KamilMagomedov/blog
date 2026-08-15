"use client";

import { IPaginator } from "@/types/Posts";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  paginator: IPaginator;
}

export const Pagination: React.FC<PaginationProps> = ({ paginator }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { current_page, last_page } = paginator;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");

    params.set("page", String(page));

    router.push(`${pathname}?${params.toString()}`);
  };

  function range(start: number, end: number): number[] {
    const ans: number[] = [];
    for (let i = start; i <= end; i++) {
      ans.push(i);
    }
    return ans;
  }

  return (
    <div className="relative bottom-0 left-1/2 mt-4 flex -translate-x-[50%] items-center justify-center gap-2 xs:pb-8 2xl:pb-20">
      <button
        onClick={() => goToPage(current_page - 1)}
        disabled={current_page === 1}
        className="rounded border px-3 py-1 disabled:opacity-50"
      >
        « Prev
      </button>

      {range(1, last_page).map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`rounded border px-3 py-1 ${
            page === current_page ? "bg-blue-500 text-white" : ""
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => goToPage(current_page + 1)}
        disabled={current_page === last_page}
        className="rounded border px-3 py-1 disabled:opacity-50"
      >
        Next »
      </button>
    </div>
  );
};
