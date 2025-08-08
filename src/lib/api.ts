import { Author } from "@/types/AboutAuthorInfromation";
import { ISendDataToBackend, ITag } from "@/types/Common";
import { IContactsInformation } from "@/types/ContactInformation";
import { IGetPostQueryBuilder, IPaginator, IPost } from "@/types/Posts";
import { ICategories, IPostCalendar } from "@/types/Travel";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("Environment variable NEXT_PUBLIC_API_URL is not defined.");
}

export const fetchPosts = async (postQueryBuilder: IGetPostQueryBuilder) => {
  try {
    const response = await fetch(
      `${API_URL}/v1/blog/posts?${postQueryBuilder.build()}`,
      {
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status} ${response}`);
    }

    const data = await response.json();

    return {
      data: data.data as IPost[],
      paginator: data.paginator as IPaginator,
      success: data.success,
    };
  } catch (error) {
    console.log(error);
  }
  return {
    data: [] as IPost[],
    paginator: {} as IPaginator,
    success: false,
  };
};

export const getPostById = async (postId: string): Promise<IPost> => {
  if (!postId) throw new Error("Post Id is required");

  try {
    const response = await fetch(`${API_URL}/v1/blog/posts/${postId}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status}`);
    }

    const post = await response.json();
    return post.data as IPost;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getCategories = async (): Promise<ICategories | null> => {
  try {
    const response = await fetch(
      `${API_URL}/v1/blog/categories?with_count_posts=1`,
      {
        next: { revalidate: 86400 },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getPostsCalendar = async (): Promise<IPostCalendar[]> => {
  try {
    const response = await fetch(`${API_URL}/v1/blog/posts-calendar`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts calendar: ${response.status}`);
    }

    const calendar = await response.json().then((res) => res.data);

    return calendar || [];
  } catch (error) {
    console.error("Error fetching posts calendar:", error);
    return [];
  }
};

export const getComments = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/v1/blog/posts/${id}/comments`);

    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.status}`);
    }

    const comments = await response.json();

    return comments.data;
  } catch (error) {
    console.log(error);
  }
};

export const getContactItems =
  async (): Promise<IContactsInformation | null> => {
    try {
      const response = await fetch(`${API_URL}/contact-items`, {
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch contact items: ${response.status}`);
      }

      const contactItems = await response.json();

      return contactItems;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

export const getAuthorInformation = async (): Promise<Author> => {
  let contacts;
  try {
    const response = await fetch(`${API_URL}/v1/blog/about`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch contact items: ${response.status}`);
    }

    contacts = await response.json();
  } catch (error) {
    console.log(error);
  }
  return contacts;
};

export const getTags = async (param: string | null = null): Promise<ITag[]> => {
  let tags;
  try {
    const response = await fetch(`${API_URL}/v1/blog/posts/tags?type=${param}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch contact items: ${response.status}`);
    }
    const takeTags = await response.json();
    tags = takeTags.data;
  } catch (error) {
    console.log(error);
  }
  return tags;
};

export const likePost = async (id: number): Promise<boolean> => {
  let result = false;
  try {
    const response = await fetch(`${API_URL}/v1/blog/posts/${id}/likes`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch contact items: ${response.status}`);
    }
    result = true;
  } catch (error) {
    console.log(error);
  }
  return result;
};

export const disLikePost = async (id: number): Promise<boolean> => {
  let result = false;
  try {
    const response = await fetch(`${API_URL}/v1/blog/posts/${id}/dislikes`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch contact items: ${response.status}`);
    }
    result = true;
  } catch (error) {
    console.log(error);
  }
  return result;
};

export const sendDataToBackend = async (
  data: ISendDataToBackend,
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/user-visits`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to send data: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error sending data to the backend: ", error);
    return false;
  }
};
