export interface ITag {
  id: number;
  name: string;
  slug: string;
}

export interface IUpdateLikedPost {
  data: number[];
  success: boolean;
}
