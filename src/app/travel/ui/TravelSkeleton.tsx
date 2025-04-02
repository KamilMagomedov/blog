const TravelSkeleton: React.FC = () => {
  return (
    <ul className="flex flex-col">
      {Array.from({ length: 4 }).map((_, i) => (
        <li
          key={i}
          className="flex w-full max-w-[100%] animate-pulse flex-col items-center xs:mb-8 lg:mb-12"
        >
          <div className="overflow-hidden rounded-[20px] bg-gray-300 xs:mb-4 xs:h-[260px] xs:w-[260px] lg:mb-6 lg:h-[400px] lg:w-[400px]" />
          <div className="flex w-full flex-col gap-3 lg:px-[15px]">
            <div className="h-6 w-3/4 rounded bg-gray-300" />

            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 w-full rounded bg-gray-300" />
            ))}

            <div className="mb-6 h-4 w-full rounded bg-gray-300" />
            <div className="flex gap-4 xs:mb-4 xs:flex-col lg:mb-8 lg:flex-row">
              <div className="h-[60px] w-[60px] rounded-full bg-gray-300" />
              <div className="flex flex-col gap-2">
                <div className="mb-4 h-4 w-24 rounded bg-gray-300" />
                <div className="h-3 w-16 rounded bg-gray-300" />
              </div>
            </div>
            <div className="flex justify-between gap-4 xs:flex-col-reverse md:flex-row">
              <div className="h-[60px] w-[183px] rounded-[30px] bg-gray-300" />
              <div className="flex gap-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-4 w-10 rounded bg-gray-300" />
                ))}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TravelSkeleton;
