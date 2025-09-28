import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getUserById } from "@/app/lib/user";
import { updateUserStripeId } from "@/app/lib/actions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

// POST /api/checkout
export async function POST(req: Request) {
  try {
    const { userId, planId } = await req.json(); 
    // フロントから userId と planに対応する Stripe priceId を渡す

    // DBからユーザー取得
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 既に Stripe customerId を持っているかチェック
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: String(user.id) },
      });
      customerId = customer.id;

      // DBに保存（必要なら）
      await updateUserStripeId(user.id, customerId);
    }

    // Checkout セッション作成
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [
        {
          price: planId, // Stripe ダッシュボードで作った price_xxx
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
