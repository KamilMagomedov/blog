import { sql } from "@/lib/db";
import { Data } from "@/types/AboutAuthorInfromation";
import { ITag } from "@/types/Common";
import {
  IContactInformation,
  IContactsInformation,
} from "@/types/ContactInformation";
import {
  IGetPostQueryBuilder,
  IPaginator,
  IPost,
  IComment,
} from "@/types/Posts";
import { ICategories, IPostCalendar } from "@/types/Travel";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const mapPostDates = (post: any) => {
  const authorAvatar =
    post.author_avatar || post.author?.avatar || "/author.jpg";

  return {
    ...post,
    coverImage: post.cover_image,
    image: post.cover_image,
    published_at: formatDate(post.published_at),
    likes: post.likes ?? 0,
    views: post.views ?? 0,
    comments_count: post.comments_count ?? 0,
    author: {
      name: post.author_name || post.author?.name || "Kamil Mahomedov",
      avatar: authorAvatar,
      image: authorAvatar,
    },
  };
};

export const fetchPosts = async (postQueryBuilder: IGetPostQueryBuilder) => {
  try {
    const queryString = postQueryBuilder?.build ? postQueryBuilder.build() : "";
    const searchParams = new URLSearchParams(queryString);

    const type = searchParams.get("type");
    const search = searchParams.get("search");

    const searchPattern = search ? `%${search}%` : null;

    let posts = [];

    if (searchPattern && type) {
      posts = await sql`
        SELECT
          posts.id,
          posts.category_id,
          posts.title,
          posts.type,
          posts.excerpt,
          posts.content,
          posts.cover_image,
          posts.published_at,
          posts.likes,
          posts.views,
          (
            SELECT COUNT(*)::int
            FROM comments c
            WHERE c.post_id = posts.id
          ) AS comments_count
        FROM posts
        WHERE posts.type = ${type}
          AND (
            posts.title ILIKE ${searchPattern}
            OR posts.content ILIKE ${searchPattern}
          )
        ORDER BY posts.published_at DESC
        LIMIT 10
      `;
    } else if (searchPattern) {
      posts = await sql`
        SELECT
          posts.id,
          posts.category_id,
          posts.title,
          posts.type,
          posts.excerpt,
          posts.content,
          posts.cover_image,
          posts.published_at,
          posts.likes,
          posts.views,
          (
            SELECT COUNT(*)::int
            FROM comments c
            WHERE c.post_id = posts.id
          ) AS comments_count
        FROM posts
        WHERE posts.title ILIKE ${searchPattern}
          OR posts.content ILIKE ${searchPattern}
        ORDER BY posts.published_at DESC
        LIMIT 10
      `;
    } else if (type) {
      posts = await sql`
        SELECT
          posts.id,
          posts.category_id,
          posts.title,
          posts.type,
          posts.excerpt,
          posts.content,
          posts.cover_image,
          posts.published_at,
          posts.likes,
          posts.views,
          (
            SELECT COUNT(*)::int
            FROM comments c
            WHERE c.post_id = posts.id
          ) AS comments_count
        FROM posts
        WHERE posts.type = ${type}
        ORDER BY posts.published_at DESC
        LIMIT 10
      `;
    } else {
      posts = await sql`
        SELECT
          posts.id,
          posts.category_id,
          posts.title,
          posts.type,
          posts.excerpt,
          posts.content,
          posts.cover_image,
          posts.published_at,
          posts.likes,
          posts.views,
          (
            SELECT COUNT(*)::int
            FROM comments c
            WHERE c.post_id = posts.id
          ) AS comments_count
        FROM posts
        ORDER BY posts.published_at DESC
        LIMIT 10
      `;
    }

    return {
      data: posts.map(mapPostDates) as unknown as IPost[],
      paginator: {
        current_page: 1,
        per_page: 10,
        last_page: 1,
        total: posts.length,
        has_more: false,
      } as IPaginator,
      success: true,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      data: [] as IPost[],
      paginator: {
        current_page: 1,
        per_page: 10,
        last_page: 1,
        total: 0,
        has_more: false,
      } as IPaginator,
      success: false,
    };
  }
};

// 2. Получение одного поста по ID
export const getPostById = async (postId: string): Promise<IPost> => {
  if (!postId) throw new Error("Post Id is required");

  try {
    const posts = await sql`
      SELECT
        posts.*,
        (
          SELECT COUNT(*)::int
          FROM comments c
          WHERE c.post_id = posts.id
        ) AS comments_count
      FROM posts
      WHERE posts.id = ${postId}
      LIMIT 1
    `;
    if (!posts.length) {
      throw new Error("Post not found");
    }

    const rawPost = posts[0];
    const mappedPost = mapPostDates(rawPost);

    return {
      ...mappedPost,
      images:
        Array.isArray(rawPost.images) && rawPost.images.length > 0
          ? rawPost.images
          : rawPost.cover_image
            ? [rawPost.cover_image]
            : [],
      likes: rawPost.likes ?? 0,
      views: rawPost.views ?? 0,
    } as unknown as IPost;
  } catch (error) {
    console.error("Error fetching post by id:", error);
    throw error;
  }
};

// 3. Получение категорий
export const getCategories = async (): Promise<ICategories | null> => {
  try {
    const categories = await sql`
      SELECT 
        c.id, 
        c.name AS title, 
        COUNT(p.id)::int AS posts_count
      FROM categories c
      LEFT JOIN posts p ON p.category_id = c.id
      GROUP BY c.id, c.name
    `;

    return { data: categories } as unknown as ICategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
};

// 4. Календарь постов
export const getPostsCalendar = async (): Promise<IPostCalendar[]> => {
  try {
    const posts = await sql`
      SELECT published_at 
      FROM posts 
      WHERE published_at IS NOT NULL 
      ORDER BY published_at DESC
    `;

    // Группируем посты по годам и месяцам
    const calendarMap: Record<
      string,
      Record<string, { monthName: string; total: number }>
    > = {};

    posts.forEach((post) => {
      const date = new Date(post.published_at);
      const year = date.getFullYear().toString();
      const monthNum = (date.getMonth() + 1).toString().padStart(2, "0");
      const monthName = date.toLocaleString("en-US", { month: "long" });

      if (!calendarMap[year]) {
        calendarMap[year] = {};
      }

      if (!calendarMap[year][monthNum]) {
        calendarMap[year][monthNum] = { monthName, total: 0 };
      }

      calendarMap[year][monthNum].total += 1;
    });

    // Преобразуем структуру в массив [{ year, months: [...] }]
    return Object.keys(calendarMap).map((year) => ({
      year,
      months: Object.keys(calendarMap[year]).map((month) => ({
        month,
        monthName: calendarMap[year][month].monthName,
        total: calendarMap[year][month].total,
      })),
    })) as unknown as IPostCalendar[];
  } catch (error) {
    console.error("Error fetching posts calendar:", error);
    return [];
  }
};

// 5. Комментарии
export async function getComments(postId: string): Promise<IComment[]> {
  const numericPostId = Number(postId);

  if (Number.isNaN(numericPostId)) {
    return [];
  }

  try {
    const rawComments = await sql`
      SELECT id, post_id, parent_id, name, email, comment, logo, created_at
      FROM comments
      WHERE post_id = ${numericPostId}
      ORDER BY created_at ASC
    `;

    const map = new Map<number, IComment>();
    const roots: IComment[] = [];

    rawComments.forEach((item: any) => {
      map.set(item.id, { ...item, comments: [] });
    });

    rawComments.forEach((item: any) => {
      if (item.parent_id && map.has(item.parent_id)) {
        map.get(item.parent_id)!.comments?.push(map.get(item.id)!);
      } else {
        roots.push(map.get(item.id)!);
      }
    });

    return roots;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return [];
  }
}

// 6. Контакты
export const getContactItems =
  async (): Promise<IContactsInformation | null> => {
    try {
      const data = await sql`
        SELECT id, title, value 
        FROM contact_information
      `;

      return {
        data: data as unknown as IContactInformation[],
        success: true,
      };
    } catch (error) {
      console.error("Error fetching contact items:", error);
      return {
        data: null,
        success: false,
      };
    }
  };

// 7. Об авторе
export const getAuthorInformation = async (): Promise<Data | null> => {
  try {
    const author = await sql`
      SELECT id, name, email, phone, image, text 
      FROM author 
      LIMIT 1
    `;

    if (author && author.length > 0) {
      return author[0] as unknown as Data;
    }

    return null;
  } catch (error) {
    console.error("Error fetching author info:", error);
    return null;
  }
};

// 8. Теги
export const getTags = async (param: string | null = null): Promise<ITag[]> => {
  try {
    const tags = param
      ? await sql`
          SELECT id, name, slug 
          FROM tags 
          WHERE slug = ${param} OR name ILIKE ${"%" + param + "%"}
        `
      : await sql`SELECT id, name, slug FROM tags`;

    return tags as unknown as ITag[];
  } catch {
    const defaultTags = [
      { id: 1, name: "Travel", slug: "travel" },
      { id: 2, name: "Development", slug: "development" },
      { id: 3, name: "Next.js", slug: "nextjs" },
    ];

    if (!param) return defaultTags as unknown as ITag[];

    return defaultTags.filter(
      (tag) =>
        tag.slug.toLowerCase() === param.toLowerCase() ||
        tag.name.toLowerCase().includes(param.toLowerCase()),
    ) as unknown as ITag[];
  }
};

// 9. Лайки и Дизлайки
export const likePost = async (id: number): Promise<boolean> => {
  try {
    await sql`UPDATE posts SET likes = COALESCE(likes, 0) + 1 WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const disLikePost = async (id: number): Promise<boolean> => {
  try {
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getPopularPosts = async (): Promise<IPost[]> => {
  try {
    const posts = await sql`
      SELECT
        posts.id,
        posts.category_id,
        posts.title,
        posts.type,
        posts.excerpt,
        posts.content,
        posts.cover_image,
        posts.published_at,
        posts.likes,
        posts.views,
        (
          SELECT COUNT(*)::int
          FROM comments c
          WHERE c.post_id = posts.id
        ) AS comments_count
      FROM posts
      ORDER BY
        COALESCE(posts.likes, 0) DESC,
        COALESCE(posts.views, 0) DESC
      LIMIT 3
    `;

    return posts.map(mapPostDates) as IPost[];
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    return [];
  }
};
