const PostSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="mx-auto mb-6 h-[270px] w-full max-w-[600px] rounded-xl bg-gray-300"></div>
      <div className="mb-2 h-[72px] w-full bg-gray-300"></div>

      <div className="flex items-center space-x-4 xs:flex-col 2xl:mb-2 2xl:flex-row">
        {Array.from({ length: 3 }).map((_, i) => (
          <span
            key={i}
            className="h-5 w-[143px] bg-gray-300 xs:mb-2 2xl:mb-0 2xl:mr-[5px]"
          ></span>
        ))}
      </div>

      {Array.from({ length: 5 }).map((_, i, arr) => (
        <p
          key={i}
          className={`h-5 w-full bg-gray-300 ${i === arr.length - 1 ? "mb-6" : ""}`}
        ></p>
      ))}

      <div className="mb-6 flex">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-[27px] w-[42px] bg-gray-300"></div>
        ))}
      </div>

      <div className="mb-4 mr-1 h-5 w-[38px] bg-gray-300 px-[10px] py-1"></div>

      <div className="h-[27px] w-[180px] rounded-lg bg-gray-200 px-5 py-2 xs:mx-auto xs:mb-6 xs:mt-0 lg:-mx-0 2xl:mb-8"></div>
    </div>
  );
};

export default PostSkeleton;
