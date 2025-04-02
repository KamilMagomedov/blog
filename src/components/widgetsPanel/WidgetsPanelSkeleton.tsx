import React from "react";

const WidgetsPanelSkeleton: React.FC = () => {
  return (
    <div className="sidebar 2xl:flex-basic-[33.3%] xs:flex-basic-[100%] animate-pulse bg-[#f8f9fa] pt-12 xs:w-full xs:max-w-[100%] 2xl:w-1/3 2xl:max-w-[33.333%] 2xl:flex-shrink-0 2xl:flex-grow-0">
      <div className="mb-[40px]">
        <div className="mx-auto h-[52px] bg-gray-300 xs:w-[270px] md:w-[400px] 2xl:w-[270px]"></div>
      </div>
      <div className="mb-[40px]">
        <div className="mx-auto xs:w-[270px] md:w-[400px] 2xl:w-[270px]">
          <div className="mb-[30px] h-[28px] w-[110px] bg-gray-300"></div>
          <ul>
            {Array.from({ length: 2 }).map((_, i) => (
              <li key={i} className="mb-[10px] pb-[10px]">
                <div className="h-[27px] w-full bg-gray-300"></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mb-[40px]">
        <div className="mx-auto xs:w-[270px] md:w-[400px] 2xl:w-[270px]">
          <div className="mb-[30px] h-[28px] w-[110px] bg-gray-300"></div>
          <div className="flex">
            <ul>
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="mb-6 flex">
                  <div className="relative mr-5 h-[80px] w-[80px] flex-shrink-0 flex-grow-0 basis-[80px] bg-gray-300"></div>
                  <div className="[w-calc(100%-100px)] mb-6">
                    <div className="w-42 mb-2 h-5 bg-gray-300"></div>
                    <div className="mb-1 h-4 w-40 bg-gray-300"></div>
                    <div className="mb-1 h-4 w-40 bg-gray-300"></div>
                    <div className="mb-1 h-4 w-40 bg-gray-300"></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mb-[40px]">
        <div className="mx-auto xs:w-[270px] md:w-[400px] 2xl:w-[270px]">
          <div className="mb-[30px] h-[28px] w-[110px] bg-gray-300"></div>
          <div className="flex">
            <p className="mr-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className="mb-[7px] mr-1 inline-block h-5 w-[36px] rounded border border-solid bg-gray-300 px-[10px] py-1"
                ></span>
              ))}
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto mb-[40px] bg-gray-300 px-[25px] xs:h-[271px] xs:w-[290px] md:h-[370px] md:w-[520px] 2xl:h-[271px] 2xl:w-[350px]"></div>
      <div className="mb-[40px]">
        <div className="mx-auto xs:w-[270px] md:w-[400px] 2xl:w-[270px]">
          <div className="mb-[30px] h-[28px] w-[110px] bg-gray-300"></div>
          <ul className="mb-4">
            {Array.from({ length: 2 }).map((_, i) => {
              return (
                <li
                  key={i}
                  className="mb-[10px] flex h-[27px] w-[110px] bg-gray-300"
                ></li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WidgetsPanelSkeleton;
