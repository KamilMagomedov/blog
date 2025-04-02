export interface IPosts {
  data: IPost[];
  paginator: IPaginator;
  success: boolean;
}

export interface IPost {
  id: number;
  category: ICategory;
  comments_count: number;
  author: IAuthor;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  type: string;
  slug: null | string;
  views?: number;
  likes: number;
  published_at: string;
  tags?: string[];
}

export interface ICategory {
  id: number;
  title: string;
}

export interface IAuthor {
  name: string;
  image: string;
}

export interface IPaginator {
  per_page: number;
  current_page: number;
  last_page: number;
  total: number;
  has_more: boolean;
}

export interface IComments {
  data: IComment[];
  paginator: IPaginator;
  success: boolean;
}

export interface IComment {
  id: number;
  name: string;
  email: string;
  comment: string;
  created_at: string;
  comments: null | IComment[];
  logo: string | null;
}

export interface IGetPostQueryBuilder {
  page: string | undefined;
  search: string | null | undefined;
  limit: number | null;
  type: string | null;
  category: string | null;
  tags: string | null | undefined;
  order: string | null;
  dir: string | null;
  archive: string | undefined | null;
  setPage: (param: string | undefined) => this;
  setSearch: (param: string | null | undefined) => this;
  setLimit: (param: number | null) => this;
  setType: (param: string | null) => this;
  setCategory: (param: string | null) => this;
  setTags: (param: string | null | undefined) => this;
  setOrder: (param: string | null) => this;
  setDir: (param: string | null) => this;
  setArchive: (date: string | undefined | null) => this;
  build: () => string;
}
