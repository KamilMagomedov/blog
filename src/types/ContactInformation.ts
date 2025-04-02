export interface IContactsInformation {
  data: IContactInformation[] | null;
  success: boolean;
}

export interface IContactInformation {
  id: number;
  image: string;
  title: string;
  value: string;
}
