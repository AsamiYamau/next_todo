export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: number;
};

export type CheckListItem = {
  id: string;
  title: string;
  status: boolean;
};
export type Project = {
  id: string;
  title: string;
  client: string;
};

export type CheckListItemWithCategories = {
  id: string;
  title: string;
  status: boolean;
  categories: { id: string; title: string }[];
};