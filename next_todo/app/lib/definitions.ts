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
      created_user: string; // 追加者のID
  created_user_name: string; // ← ユーザー名
  checked_user_name: string | null; // チェックしたユーザー名
  created_at: string; // 作成日時
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
    created_user: string; // 追加者のID
  created_user_name: string; // ← ユーザー名
  checked_user_name: string | null; // チェックしたユーザー名
  created_at: string; // 作成日時
  checked_at: string | null; // チェック日時
};