// app/api/portal-link/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getUserById } from "@/app/lib/user";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    // ユーザー取得
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== 1) {
      return NextResponse.json({ error: "Only owners can change plans" }, { status: 403 });
    }

    if (!user.stripe_customer_id) {
      return NextResponse.json({ error: "No Stripe customer ID found" }, { status: 400 });
    }

    // Customer Portal セッション作成
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`, // 戻るページ
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err: any) {
    console.error("Portal link error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
