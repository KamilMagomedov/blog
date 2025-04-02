import ClientCommentsComponent from "@/components/clientCommentsComponent/ClientCommentsComponent";
import PostBody from "@/components/post/PostBody";
import { getComments, getPostById } from "@/lib/api";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: { postId: string };
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { postId } = await params;
  const post = await getPostById(postId);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "This post does not exist.",
    };
  }

  return {
    title: `${post.meta_title} | Blog`,
    description: post.meta_description.substring(0, 150) + "...",
    keywords: post.meta_keywords || ["blog", "post", "frontend", "programming"],
  };
}

const PostPage: React.FC<PostPageProps> = async ({ params }) => {
  const { postId } = await params;

  if (!postId) return notFound();

  const post = await getPostById(postId);
  const comments = await getComments(postId);

  if (!post) return notFound();

  return (
    <section className="float-right flex h-full py-20 xs:w-full xs:flex-col lg:w-3/4 xl:flex-row">
      <div className="container mx-auto px-[15px] sm:w-[540px] md:w-[720px] lg:w-[960px] lg:max-w-full xl:w-[1140px]">
        <div className="mx-auto px-4 lg:w-2/3 2xl:pb-12">
          <PostBody post={post} />
          <ClientCommentsComponent comments={comments} id={post.id} />
        </div>
      </div>
    </section>
  );
};

export default PostPage;
