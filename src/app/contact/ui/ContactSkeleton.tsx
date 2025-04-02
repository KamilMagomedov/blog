import { lora } from "@/styles/fonts";

const ContactSkeleton: React.FC = () => {
  return (
    <>
      <h2
        className={`${lora.className} mb-6 text-[1.75rem] font-normal leading-6 text-black xs:text-center lg:text-left`}
      >
        Contact Information
      </h2>
      <div className="flex gap-5 xs:flex-col lg:mb-10 lg:flex-row lg:flex-wrap lg:justify-between xl:flex-nowrap xl:justify-normal">
        {Array.from({ length: 4 }).map((_, i) => {
          return (
            <div
              key={i}
              className="mb-6 animate-pulse bg-gray-300 p-6 px-[15px] xs:min-h-[70px] xs:w-full lg:min-h-[170px] lg:w-[45%] xl:w-1/4"
            >
              <div className="mb-2 h-4 w-3/4 rounded bg-gray-300"></div>
              <div className="h-3 w-1/2 rounded bg-gray-300"></div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ContactSkeleton;
