'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import bcrypt from 'bcryptjs';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/login');
    } else {
      setError('登録に失敗しました');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">新規登録</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full p-2 border mb-2" placeholder="Name" />
      <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full p-2 border mb-2" placeholder="Email" />
      <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="w-full p-2 border mb-4" placeholder="Password" />
      <button className="w-full bg-green-500 text-white p-2 rounded">登録</button>
    </form>
  );
}
