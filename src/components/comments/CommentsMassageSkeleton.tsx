import ReplyCommentSkeleton from "./ReplyCommentSkeleton";

const CommentsMassageSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="mb-12 h-[1.75rem] w-[190px] bg-gray-300"></div>
      <ul>
        <li>
          {Array.from({ length: 4 }).map((_, i) => {
            return (
              <div key={i} className="mb-5 flex">
                <div className="mr-[30px] flex h-[75px] w-[75px] items-center justify-center rounded-full bg-gray-300"></div>
                <div>
                  <div className="h-5 bg-gray-300"></div>
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="h-[13px] w-[200px]"></div>
                  ))}

                  <ReplyCommentSkeleton />
                </div>
              </div>
            );
          })}
        </li>
      </ul>
    </div>
  );
};

export default CommentsMassageSkeleton;
