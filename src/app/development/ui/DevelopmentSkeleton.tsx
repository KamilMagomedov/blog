const DevelopmentSkeleton: React.FC = () => {
  return (
    <ul className="flex flex-col px-[15px]">
      {Array.from({ length: 10 }).map((_, i) => (
        <li
          key={i}
          className="mb-12 flex w-full items-center xs:mb-8 xs:flex-col lg:max-w-[90%] lg:flex-row"
        >
          <div className="relative h-[150px] w-[150px] overflow-hidden rounded-[20px] bg-gray-300 xs:mb-4 xs:mr-0 lg:mb-0 lg:mr-4"></div>
          <div className="w-[70%]">
            <h3
              className={`mb-6 h-6 w-full bg-gray-300 xs:h-[1.3rem] lg:h-[1.85rem]`}
            ></h3>
            <div className="flex xs:flex-col">
              <div className="flex items-center xs:mb-0 xs:flex-col md:mx-auto md:my-0 md:flex-row lg:mx-0 lg:mb-6">
                <div className="xs:row flex xs:items-center xs:align-middle">
                  <div className="mr-[10px] h-[14px] w-[14px] bg-gray-300" />{" "}
                  <p className="mr-[10px] h-[14px] w-[132px] bg-gray-300"></p>
                </div>
                <p className="h-[14px] w-[132px] bg-gray-300 xs:mr-0 md:mr-[10px]"></p>
                <div className="xs:row flex xs:items-center xs:align-middle">
                  <div className="mr-[10px] h-[14px] w-[14px] bg-gray-300" />{" "}
                  <p className="mr-[10px] h-[14px] w-[132px] bg-gray-300"></p>
                </div>
              </div>
              {Array.from({ length: 3 }).map((_, i) => (
                <p
                  key={i}
                  className="mb-6 line-clamp-3 h-4 w-full bg-gray-300 xs:mb-2"
                ></p>
              ))}
              <p className="mr-4 h-[27px] max-w-[82px] bg-gray-300">
                <span className="h-[21px] w-[21px] bg-gray-300"></span>
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default DevelopmentSkeleton;
