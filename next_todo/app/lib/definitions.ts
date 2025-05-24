export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
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