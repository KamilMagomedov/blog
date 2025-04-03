import React from "react";

const AboutSkeleton: React.FC = () => {
  return (
    <section className="float-right flex h-full animate-pulse xs:w-full xs:flex-col lg:w-3/4 xl:flex-row">
      <div className="h-full rounded-[20px] bg-gray-300 object-cover xs:w-full xl:w-1/2" />

      <div className="flex items-center px-[15px] pt-12 xs:w-full xl:w-1/2">
        <div className="justify-content flex flex-col items-center xs:w-full lg:px-6">
          <div className="mb-2 h-6 bg-gray-300 xs:w-full md:h-8 xl:w-full"></div>
          <div className="mb-2 h-6 bg-gray-300 xs:w-[90%] md:h-8 xl:w-[90%]"></div>
          {Array.from({ length: 4 }).map((_, i) => {
            return (
              <p
                key={i}
                className="mb-2 h-4 bg-gray-300 xs:w-full md:h-6 lg:w-[80%]"
              ></p>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSkeleton;
