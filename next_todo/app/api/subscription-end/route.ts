// app/api/cancel-subscription/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: NextRequest) {
  const { subscriptionId } = await req.json();

  try {
    // Stripeでサブスクリプション解約
    await stripe.subscriptions.cancel(subscriptionId);
    return NextResponse.json({ message: "退会手続き完了" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
