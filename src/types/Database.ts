export interface PostDatabaseRow {
  id: number;
  category_id: number | null;

  title: string;
  type: string;

  description?: string | null;
  content: string | null;
  excerpt: string | null;

  cover_image: string | null;
  images?: string[] | null;

  published_at: string | Date | null;

  likes: number | null;
  views: number | null;
  comments_count?: number | null;

  category_name?: string | null;

  author_name?: string | null;
  author_avatar?: string | null;
}

export interface CommentDatabaseRow {
  id: number;
  post_id: number;
  parent_id: number | null;

  name: string;
  email: string;
  comment: string;

  logo: string | null;
  created_at: string | Date;
}

export interface CategoryDatabaseRow {
  id: number;
  title: string;
  posts_count: number;
}

export interface TagDatabaseRow {
  id: number;
  name: string;
  slug: string;
}

export interface CalendarPostDatabaseRow {
  published_at: string | Date;
}

export interface ContactDatabaseRow {
  id: number;
  image: string | null;
  title: string;
  value: string;
}

export interface AuthorDatabaseRow {
  name: string;
  image: string | null;
  text: string | null;
}
