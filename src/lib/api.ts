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
  let page = 1;
  let limit = 10;

  try {
    const queryString = postQueryBuilder?.build ? postQueryBuilder.build() : "";

    const searchParams = new URLSearchParams(queryString);

    const type = searchParams.get("type") || null;
    const search = searchParams.get("search")?.trim() || null;
    const archive = searchParams.get("archive") || null;
    const category = searchParams.get("category") || null;
    const tag = searchParams.get("tags")?.trim() || null;

    const limitParam = Number(searchParams.get("limit"));
    const pageParam = Number(searchParams.get("page"));

    limit =
      Number.isFinite(limitParam) && limitParam > 0
        ? Math.min(limitParam, 100)
        : 10;

    page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

    const offset = (page - 1) * limit;

    const searchPattern = search ? `%${search}%` : null;

    const orderParam = searchParams.get("order");
    const dirParam = searchParams.get("dir");

    const order =
      orderParam === "likes" ||
      orderParam === "views" ||
      orderParam === "published_at"
        ? orderParam
        : "published_at";

    const dir = dirParam === "asc" ? "asc" : "desc";

    const sortLikesAsc = order === "likes" && dir === "asc";
    const sortLikesDesc = order === "likes" && dir === "desc";

    const sortViewsAsc = order === "views" && dir === "asc";
    const sortViewsDesc = order === "views" && dir === "desc";

    const sortDateAsc = order === "published_at" && dir === "asc";
    const sortDateDesc = order === "published_at" && dir === "desc";

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

      WHERE
        (
          ${type}::text IS NULL
          OR posts.type = ${type}
        )

        AND (
          ${searchPattern}::text IS NULL
          OR posts.title ILIKE ${searchPattern}
          OR posts.content ILIKE ${searchPattern}
          OR posts.excerpt ILIKE ${searchPattern}
        )

        AND (
          ${archive}::text IS NULL
          OR TO_CHAR(posts.published_at, 'YYYY-MM') = ${archive}
        )

        AND (
          ${category}::text IS NULL
          OR EXISTS (
            SELECT 1
            FROM categories cat
            WHERE cat.id = posts.category_id
              AND (
                cat.id::text = ${category}
                OR LOWER(cat.name) = LOWER(${category})
              )
          )
        )

        AND (
          ${tag}::text IS NULL
          OR EXISTS (
            SELECT 1
            FROM post_tags pt
            JOIN tags t ON t.id = pt.tag_id
            WHERE pt.post_id = posts.id
              AND (
                LOWER(t.slug) = LOWER(${tag})
                OR LOWER(t.name) = LOWER(${tag})
              )
          )
        )

      ORDER BY
        CASE
          WHEN ${sortLikesAsc}
          THEN COALESCE(posts.likes, 0)
        END ASC,

        CASE
          WHEN ${sortLikesDesc}
          THEN COALESCE(posts.likes, 0)
        END DESC,

        CASE
          WHEN ${sortViewsAsc}
          THEN COALESCE(posts.views, 0)
        END ASC,

        CASE
          WHEN ${sortViewsDesc}
          THEN COALESCE(posts.views, 0)
        END DESC,

        CASE
          WHEN ${sortDateAsc}
          THEN posts.published_at
        END ASC,

        CASE
          WHEN ${sortDateDesc}
          THEN posts.published_at
        END DESC,

        posts.id DESC

      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*)::int AS total

      FROM posts

      WHERE
        (
          ${type}::text IS NULL
          OR posts.type = ${type}
        )

        AND (
          ${searchPattern}::text IS NULL
          OR posts.title ILIKE ${searchPattern}
          OR posts.content ILIKE ${searchPattern}
          OR posts.excerpt ILIKE ${searchPattern}
        )

        AND (
          ${archive}::text IS NULL
          OR TO_CHAR(posts.published_at, 'YYYY-MM') = ${archive}
        )

        AND (
          ${category}::text IS NULL
          OR EXISTS (
            SELECT 1
            FROM categories cat
            WHERE cat.id = posts.category_id
              AND (
                cat.id::text = ${category}
                OR LOWER(cat.name) = LOWER(${category})
              )
          )
        )

        AND (
          ${tag}::text IS NULL
          OR EXISTS (
            SELECT 1
            FROM post_tags pt
            JOIN tags t ON t.id = pt.tag_id
            WHERE pt.post_id = posts.id
              AND (
                LOWER(t.slug) = LOWER(${tag})
                OR LOWER(t.name) = LOWER(${tag})
              )
          )
        )
    `;

    const total = Number(countResult[0]?.total ?? 0);

    const lastPage = Math.max(1, Math.ceil(total / limit));

    return {
      data: posts.map(mapPostDates) as unknown as IPost[],

      paginator: {
        current_page: page,
        per_page: limit,
        last_page: lastPage,
        total,
        has_more: page < lastPage,
      } as IPaginator,

      success: true,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);

    return {
      data: [] as IPost[],

      paginator: {
        current_page: page,
        per_page: limit,
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
          WHERE slug = ${param}
             OR name ILIKE ${"%" + param + "%"}
        `
      : await sql`
          SELECT id, name, slug
          FROM tags
        `;

    return tags as unknown as ITag[];
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
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
