import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ReadMoreLinkProps {
  postId: number | string;
}

const ReadMoreLink: React.FC<ReadMoreLinkProps> = ({ postId }) => {
  return (
    <Link
      href={`/post/${postId}`}
      className="group/readmore inline-flex items-center gap-1 text-[#1eafed]"
    >
      <span>Read More About Post</span>

      <ArrowRight
        size={17}
        className="transition-transform duration-300 ease-out group-hover/readmore:translate-x-1"
      />
    </Link>
  );
};

export default ReadMoreLink;
