// app/api/webhook-stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateUserPlanByStripeCustomerId } from "@/app/lib/user";
import { deleteUserAccount } from "@/app/lib/actions";

import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: NextRequest) {
  const buf = Buffer.from(await req.arrayBuffer()); // ← 型エラー解消
  const sig = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ received: false }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Checkout session completed:", session);
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        console.log("Customer ID:", customerId);
        console.log("Subscription ID:", subscriptionId);

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0].price.id;

        await updateUserPlanByStripeCustomerId(customerId, priceId);
         // DBに subscriptionId も保存
          await sql`
            UPDATE users
            SET stripe_subscription_id = ${subscriptionId}
            WHERE stripe_customer_id = ${customerId}
          `;
          break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const priceId = sub.items.data[0].price.id;

        await updateUserPlanByStripeCustomerId(customerId, priceId);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const user = await sql<{ id: string; team_id: string }[]>`
          SELECT id, team_id FROM users WHERE stripe_customer_id = ${customerId} LIMIT 1
        `;
        if (user.length === 0) {
          console.error("User not found for customer ID:", customerId);
          break;
        }
        const userId = user[0].id;
        const teamId = user[0].team_id;

        // 退会時はユーザーに紐づくデータを全て削除
        await deleteUserAccount(userId, teamId);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook handling error:", err);
    return NextResponse.json({ received: false, error: err.message }, { status: 500 });
  }
}
