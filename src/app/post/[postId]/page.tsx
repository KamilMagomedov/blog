import ClientCommentsComponent from "@/components/clientCommentsComponent/ClientCommentsComponent";
import PostBody from "@/components/post/PostBody";
import { getComments, getPostById } from "@/lib/api";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: Promise<{ postId: string }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { postId } = resolvedParams;
  const post = await getPostById(postId);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "This post does not exist.",
    };
  }

  const rawDescription =
    post.meta_description || post.title || "Blog post details";
  const description =
    rawDescription.length > 150
      ? `${rawDescription.substring(0, 150)}...`
      : rawDescription;

  return {
    title: `${post.meta_title || post.title || "Post"} | Blog`,
    description,
    keywords: post.meta_keywords || ["blog", "post", "frontend", "programming"],
  };
}

const PostPage: React.FC<PostPageProps> = async ({ params }) => {
  const resolvedParams = await params;
  const { postId } = resolvedParams;

  if (!postId) return notFound();

  const post = await getPostById(postId);
  const comments = await getComments(postId);

  if (!post) return notFound();

  return (
    <section className="min-h-screen w-full">
      <div className="mx-auto w-full max-w-[1100px] px-5 py-12 lg:px-8">
        <article className="mx-auto w-full max-w-[900px]">
          <PostBody post={post} />

          <ClientCommentsComponent comments={comments || []} id={post.id} />
        </article>
      </div>
    </section>
  );
};

export default PostPage;
