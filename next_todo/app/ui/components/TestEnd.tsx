'use client';

// userIdとteamIdをサーバーに送信し、退会処理を実行する



export default function TestEnd({userId,teamId}: {userId: string; teamId: string | null}) {
  const handleTestEnd = async () => {
    if (!confirm('本当に退会しますか？')) {
      return;
    }
    try {
      const res = await fetch('/api/subscription-endtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, teamId }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || '退会に失敗しました');
      } else {
        window.location.href = data.url;
      }
    } catch (error) {
      alert('退会に失敗しました。時間をおいて再度お試しください。');
    }
  };

  return (
    <button
      onClick={handleTestEnd}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      テスト用退会ボタン
    </button>
  );
}