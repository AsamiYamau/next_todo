// /app/api/invite/route.ts (App Router構成の場合)
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createPassToken } from '@/app/lib/actions';

const resend = new Resend(process.env.RESEND_API_KEY); 

export async function POST(req: Request) {
  const { email } = await req.json();

  try {
    // 招待トークンを生成
    const passToken = await createPassToken(email);
    console.log("passToken:", passToken);
    const data = await resend.emails.send({
      from: 'info@done-quest.com', // 本番は独自ドメインで
      to: email,
      subject: `パスワードリセットのご案内|DoneQuest`,
      html: `
        <p>パスワードリセットのご案内です。</p>
        <p>以下のリンクからパスワードを再設定してください。</p>
        <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${passToken}">パスワード再設定リンク</a></p>
        <p>このリンクの有効期限は1時間です。</p>
        <p>もし心当たりがない場合は、このメールを無視してください。</p>
      `,
    });
    console.log("Email sent:", data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error sending email:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
