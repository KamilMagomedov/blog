export interface ICategories {
  data: ICategorySummary[];
  success: boolean;
}

export interface ICategory {
  id: number;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  title: string;
  description: string;
  image: string;
  tags: ITag[];
  categories: string[];
  posts_count: number;
}

export interface ITag {
  id: number;
  name: string;
  slug: string;
}

export interface IPostCalendar {
  year: string;
  months: IMonth[];
}

export interface IMonth {
  month: string;
  total: number;
  monthName: string;
}

export interface ICategorySummary {
  id: number;
  title: string;
  posts_count: number;
}
