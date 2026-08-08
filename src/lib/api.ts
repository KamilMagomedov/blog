import { sql } from "@/lib/db";
import { Author } from "@/types/AboutAuthorInfromation";
import { ITag } from "@/types/Common";
import { IContactsInformation } from "@/types/ContactInformation";
import { IGetPostQueryBuilder, IPaginator, IPost } from "@/types/Posts";
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

const mapPostDates = (post: any) => ({
  ...post,
  coverImage: post.cover_image,
  image: post.cover_image,
  published_at: formatDate(post.published_at),
  author: post.author || { name: "Kamil Mahomedov" },
});

export const fetchPosts = async (postQueryBuilder: IGetPostQueryBuilder) => {
  try {
    const queryString = postQueryBuilder?.build ? postQueryBuilder.build() : "";
    const searchParams = new URLSearchParams(queryString);
    const type = searchParams.get("type");

    const posts = type
      ? await sql`
          SELECT id, category_id, title, type, excerpt, content, cover_image, published_at 
          FROM posts 
          WHERE type = ${type}
          ORDER BY published_at DESC 
          LIMIT 10
        `
      : await sql`
          SELECT id, category_id, title, type, excerpt, content, cover_image, published_at 
          FROM posts 
          ORDER BY published_at DESC 
          LIMIT 10
        `;

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
      SELECT id, category_id, title, type, excerpt, content, cover_image, published_at 
      FROM posts 
      WHERE id = ${postId}
      LIMIT 1
    `;

    if (!posts.length) {
      throw new Error("Post not found");
    }

    return mapPostDates(posts[0]) as unknown as IPost;
  } catch (error) {
    console.error("Error fetching post by id:", error);
    throw error;
  }
};

// 3. Получение категорий
export const getCategories = async (): Promise<ICategories | null> => {
  try {
    const categories = await sql`
      SELECT c.id, c.name, COUNT(p.id)::int as count_posts
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
export const getComments = async (id: string) => {
  try {
    return [];
  } catch (error) {
    console.error(error);
  }
};

// 6. Контакты
export const getContactItems =
  async (): Promise<IContactsInformation | null> => {
    try {
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

// 7. Об авторе
export const getAuthorInformation = async (): Promise<Author> => {
  return {} as Author;
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
