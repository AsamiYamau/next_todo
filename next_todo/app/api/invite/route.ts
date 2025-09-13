// /app/api/invite/route.ts (App Router構成の場合)
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createInvite } from '@/app/lib/actions';

const resend = new Resend(process.env.RESEND_API_KEY); 

export async function POST(req: Request) {
  const { to, teamName, teamId} = await req.json();

  try {
    // 招待トークンを生成
    const inviteToken = await createInvite(to, teamId);
    const data = await resend.emails.send({
      from: 'invite@done-quest.com', // 本番は独自ドメインで
      to: to,
      subject: `${teamName} チームからの招待`,
      html: `
        <p>${teamName} に招待されました。</p>
        <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/register?token=${inviteToken}">ここから参加</a></p>
      `,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
