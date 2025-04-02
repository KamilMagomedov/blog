import React from "react";

const AboutSkeleton: React.FC = () => {
  return (
    <section className="float-right flex h-full animate-pulse bg-gray-300 xs:w-full xs:flex-col lg:w-3/4 xl:flex-row">
      <div className="rounded-[20px] bg-gray-300 object-cover xs:w-full lg:w-1/2 xl:w-1/3" />

      {/* <div className="flex w-1/2 items-center bg-gray-300 px-[15px] pt-12 xs:w-full xs:text-center xl:text-left">
        <div className="lg:px-6">
          <div className="bg-gray-300 xs:h-8 md:h-12"></div>
          <div className="bg-gray-300 xs:pb-[30px]"></div>
        </div>
      </div> */}
    </section>
  );
};

export default AboutSkeleton;
