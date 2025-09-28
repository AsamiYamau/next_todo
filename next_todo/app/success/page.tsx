"use client";

import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [message, setMessage] = useState("契約を確認中...");

  useEffect(() => {
    // session_id はあくまで表示目的
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setMessage("セッションIDがありません");
      return;
    }

    // DB反映は Webhook で行うので、ここでは完了表示だけ
    setMessage("契約が完了しました！ありがとうございます。");
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{message}</h1>
      <p>今後の機能をお楽しみください。</p>
    </div>
  );
}
