"use client";

const CommentsCount: React.FC<{ count?: number }> = ({ count }) => {
  return (
    <div className="text-sm text-[#bfbfbf]">
      <span className="mr-[10px]">comment {count || 0}</span>
    </div>
  );
};

export default CommentsCount;
