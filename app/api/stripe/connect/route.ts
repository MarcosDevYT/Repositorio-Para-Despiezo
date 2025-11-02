import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { updateStripeConnectStatusAction } from "@/actions/user-actions";

import type Stripe from "stripe";

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_CONNECT_SECRET;
  if (!webhookSecret) {
    console.error("No STRIPE_WEBHOOK_SECRET in env");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const buf = Buffer.from(await req.arrayBuffer());
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error("⚠️  Webhook signature verification failed.", err?.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err?.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "account.updated": {
        const account = event.data.object as Stripe.Account;

        const accountUpdate = await updateStripeConnectStatusAction(account);

        console.log("AccountLink update: ", accountUpdate);

        break;
      }
      default:
        console.log("Unhandled event type:", event.type);
    }
  } catch (err) {
    console.error("Error handling webhook event", err);
    // no tirar error 500 si falló en el handler? mejor devolver 500 así Stripe reintentará.
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
