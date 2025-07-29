export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: number;
  plan: number; // ユーザープランを追加
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
  client_id?: string; // クライアントIDをオプションとして追加
  client_name?: string; // クライアント名をオプションとして追加
  user_id: string; // ユーザーID
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
export type DefaultCheckListItemWithCategories = {
  id: string;
  title: string;
  status: boolean;
  categories: { id: string; title: string }[];
    created_user: string; // 追加者のID
  created_user_name: string; // ← ユーザー名
  checked_user_name: string | null; // チェックしたユーザー名
  created_at: string; // 作成日時
  checked_at: string | null; // チェック日時
  default_project_id: string | null; // デフォルトプロジェクトID
  user_id: string | null; // ユーザーID
};

export type Client = {
  id: string;
  name: string;
  user_id: string; // ユーザーID
}