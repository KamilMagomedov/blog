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
import {
  AuthorDatabaseRow,
  CalendarPostDatabaseRow,
  CategoryDatabaseRow,
  CommentDatabaseRow,
  ContactDatabaseRow,
  PostDatabaseRow,
  TagDatabaseRow,
} from "@/types/Database";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const mapPostDates = (post: PostDatabaseRow): IPost => {
  const authorAvatar = post.author_avatar || "/author.jpg";

  return {
    id: post.id,
    title: post.title,
    type: post.type,

    description: post.description ?? undefined,
    content: post.content ?? undefined,
    excerpt: post.excerpt ?? undefined,

    cover_image: post.cover_image ?? undefined,
    image: post.cover_image ?? undefined,

    published_at: post.published_at
      ? formatDate(String(post.published_at))
      : "",

    likes: post.likes ?? 0,
    views: post.views ?? 0,
    comments_count: post.comments_count ?? 0,

    category: {
      title: post.category_name || "Uncategorized",
    },

    author: {
      name: post.author_name || "Kamil Mahomedov",
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

    const typedPosts = posts as PostDatabaseRow[];

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
      data: typedPosts.map(mapPostDates),

      paginator: {
        current_page: page,
        per_page: limit,
        last_page: lastPage,
        total,
        has_more: page < lastPage,
      },

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
  const numericPostId = Number(postId);

  if (!Number.isInteger(numericPostId) || numericPostId <= 0) {
    throw new Error("Invalid Post Id");
  }

  try {
    const posts = await sql`
      SELECT
        posts.*,
        categories.name AS category_name,
        (
          SELECT COUNT(*)::int
          FROM comments c
          WHERE c.post_id = posts.id
        ) AS comments_count
      FROM posts
      LEFT JOIN categories
        ON categories.id = posts.category_id
      WHERE posts.id = ${numericPostId}
      LIMIT 1
    `;

    if (!posts.length) {
      throw new Error("Post not found");
    }

    const rawPost = posts[0] as PostDatabaseRow;
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
    };
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

    const typedCategories = categories as CategoryDatabaseRow[];

    return {
      data: typedCategories.map((category) => ({
        id: category.id,
        title: category.title,
        posts_count: category.posts_count,
      })),
      success: true,
    };
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

    const typedPosts = posts as CalendarPostDatabaseRow[];

    const calendarMap: Record<
      string,
      Record<string, { monthName: string; total: number }>
    > = {};

    typedPosts.forEach((post) => {
      const date = new Date(post.published_at);

      const year = date.getFullYear().toString();

      const monthNum = (date.getMonth() + 1).toString().padStart(2, "0");

      const monthName = date.toLocaleString("en-US", {
        month: "long",
      });

      if (!calendarMap[year]) {
        calendarMap[year] = {};
      }

      if (!calendarMap[year][monthNum]) {
        calendarMap[year][monthNum] = {
          monthName,
          total: 0,
        };
      }

      calendarMap[year][monthNum].total += 1;
    });

    const calendar: IPostCalendar[] = Object.keys(calendarMap).map((year) => ({
      year,

      months: Object.keys(calendarMap[year]).map((month) => ({
        month,
        monthName: calendarMap[year][month].monthName,
        total: calendarMap[year][month].total,
      })),
    }));

    return calendar;
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

    const comments = rawComments as CommentDatabaseRow[];

    const map = new Map<number, IComment>();
    const roots: IComment[] = [];

    comments.forEach((item) => {
      map.set(item.id, {
        id: item.id,
        name: item.name,
        email: item.email,
        comment: item.comment,
        logo: item.logo,
        created_at: formatDate(String(item.created_at)),
        comments: [],
      });
    });

    comments.forEach((item) => {
      const currentComment = map.get(item.id);

      if (!currentComment) return;

      if (item.parent_id && map.has(item.parent_id)) {
        map.get(item.parent_id)?.comments?.push(currentComment);
      } else {
        roots.push(currentComment);
      }
    });

    return roots;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return [];
  }
}

// 6. Контакты
export const getContactItems = async (): Promise<IContactsInformation> => {
  try {
    const data = await sql`
        SELECT id, title, value 
        FROM contact_information
      `;

    const typedContacts = data as ContactDatabaseRow[];

    const contacts: IContactInformation[] = typedContacts.map((contact) => ({
      id: contact.id,
      image: contact.image ?? undefined,
      title: contact.title,
      value: contact.value,
    }));

    return {
      data: contacts,
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

    const typedAuthors = author as AuthorDatabaseRow[];

    if (typedAuthors.length === 0) {
      return null;
    }

    const authorData: Data = {
      name: typedAuthors[0].name,
      image: typedAuthors[0].image ?? "/image_not_found.webp",
      text: typedAuthors[0].text ?? "",
    };

    return authorData;
  } catch (error) {
    console.error("Error fetching author information:", error);
    return null;
  }
};

// 8. Теги
export const getTags = async (): Promise<ITag[]> => {
  try {
    const tags = await sql`
      SELECT DISTINCT
        t.id,
        t.name,
        t.slug
      FROM tags t

      JOIN post_tags pt
        ON pt.tag_id = t.id

      WHERE t.slug NOT IN (
        'travel',
        'development'
      )

      ORDER BY t.name ASC
    `;

    const typedTags = tags as TagDatabaseRow[];

    return typedTags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    }));
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
};

// 9. Лайки
export const likePost = async (id: number): Promise<boolean> => {
  try {
    await sql`UPDATE posts SET likes = COALESCE(likes, 0) + 1 WHERE id = ${id}`;
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

    const typedPosts = posts as PostDatabaseRow[];

    return typedPosts.map(mapPostDates);
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    return [];
  }
};
