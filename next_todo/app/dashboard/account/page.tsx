"use client";

import { useState, useEffect } from "react";

import { getUserNameById } from "@/app/lib/data";
import { useSession } from "next-auth/react";

import Image from "next/image";
import EyeOpen from "@/public/ico/eye-open.svg";
import EyeClose from "@/public/ico/eye-close.svg";

export default function AccountPage() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id; // ユーザーIDを取得
  const userName = (session?.user as any)?.name; // ユーザー名を取得

  const [showPassword, setShowPassword] = useState(false);
  const [eyeIcon, setEyeIcon] = useState(EyeClose);

  // userNameが取得できたら初期値としてセット
  useEffect(() => {
    if (userName) {
      setName(userName);
    }
  }, [userName]);

  const [name, setName] = useState(""); // 初期値はユーザー名を取得してセットしてください
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 名前変更
  const handleNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    // ここでAPIにリクエストを送信
    // 例: /api/account/name-update へPOST
    try {
      if (!userId) {
        setError("ユーザーIDが取得できません");
        return;
      }
      await fetch("/api/name-update", {
        method: "POST",
        body: JSON.stringify({ userId, name }),
        headers: { "Content-Type": "application/json" },
      });
      setMessage("名前を変更しました");
    } catch {
      setError("名前の変更に失敗しました");
    }
  };

  // パスワード変更
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (newPassword !== confirmPassword) {
      setError("新しいパスワードが一致しません");
      return;
    }
    // ここでAPIにリクエストを送信
    // 例: /api/account/password-update へPOST
    try {
      if (!userId) {
        setError("ユーザーIDが取得できません");
        return;
      }
      const res = await fetch("/api/password-update", {
        method: "POST",
        body: JSON.stringify({ userId, currentPassword, newPassword }),
        headers: { "Content-Type": "application/json" },
      });

      //apiのレスポンス
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "パスワードの変更に失敗しました");
        return;
      }

      setMessage("パスワードを変更しました");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("パスワードの変更に失敗しました");
    }
  };

  return (
    <main className="p-6 md:p-12 max-w-lg mx-auto mt-10 space-y-10">
      <h1 className="text-2xl font-bold mb-6">アカウント設定</h1>

      {/* 名前変更フォーム */}
      <form
        onSubmit={handleNameChange}
        className="bg-white p-6 rounded shadow space-y-4"
      >
        <h2 className="font-bold text-lg">名前の変更</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="新しい名前"
          required
        />
        <button
          className="bg-sky-900 text-white px-4 py-2 rounded mt-4"
          type="submit"
        >
          名前を変更
        </button>
      </form>

      {/* パスワード変更フォーム */}
      <form
        onSubmit={handlePasswordChange}
        className="bg-white p-6 rounded shadow"
      >
        <h2 className="font-bold text-lg">パスワードの変更</h2>
        <div className="relative">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="現在のパスワード"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
            tabIndex={-1}
          >
            <Image
              src={showPassword ? EyeOpen : EyeClose}
              alt="Toggle Password Visibility"
              width={20}
              height={20}
            />
          </button>
        </div>
        <div className="relative mt-4">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="新しいパスワード"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
            tabIndex={-1}
          >
            <Image
              src={showPassword ? EyeOpen : EyeClose}
              alt="Toggle Password Visibility"
              width={20}
              height={20}
            />
          </button>
        </div>
        <div className="relative mt-4">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="新しいパスワード（確認）"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
            tabIndex={-1}
          >
            <Image
              src={showPassword ? EyeOpen : EyeClose}
              alt="Toggle Password Visibility"
              width={20}
              height={20}
            />
          </button>
        </div>
        <button
          className="bg-sky-900 text-white px-4 py-2 rounded mt-4"
          type="submit"
        >
          パスワードを変更
        </button>
      </form>

      {/* メッセージ表示 */}
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </main>
  );
}
