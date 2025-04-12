import { lora } from "@/styles/fonts";
import { IPostCalendar } from "@/types/Travel";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface IPostsCalendarProps {
  postsCalendar: IPostCalendar[];
  setIsLoadingCallback: (param: boolean) => void;
}

const Archives: React.FC<IPostsCalendarProps> = ({
  postsCalendar,
  setIsLoadingCallback,
}) => {
  const [openYear, setOpenYear] = useState<string | null>(null);
  const router = useRouter();
  const toggleYear = (year: string) => {
    setOpenYear(openYear === year ? null : year);
  };

  const showFromArchive = (year: string, month: string) => {
    setIsLoadingCallback(true);
    router.push(`/?archive=${year}-${month}`);
  };

  return (
    <div className="mb-[40px]">
      <div className="mx-auto xs:w-[270px] md:w-[400px] 2xl:w-[270px]">
        <h3
          className={`mb-[30px] text-xl italic ${lora.className} text-[#000c]`}
        >
          Archives
        </h3>
        <ul className="mb-4">
          {postsCalendar.map((calendar) => {
            const { year, months } = calendar;
            const isOpen = openYear === year;

            return (
              <li
                key={year}
                className="mb-[10px] border-b border-[#dee2e6] pb-[10px]"
              >
                <button
                  onClick={() => toggleYear(year)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="text-lg font-medium">{year}</span>
                  <ChevronDown
                    className={`transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#1eafed]" : "text-black"
                    }`}
                  />
                </button>

                <ul
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "mt-2 max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {months.map((month) => (
                    <li key={month.monthName} className="flex px-4 py-1">
                      <button
                        onClick={() => showFromArchive(year, month.month)}
                        className="flex w-full justify-between"
                      >
                        <span>{month.monthName}</span>
                        <span className="text-[#6c757d]">{month.total}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Archives;
