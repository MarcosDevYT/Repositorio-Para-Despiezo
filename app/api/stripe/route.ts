import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";
import {
  handleCheckoutCompleted,
  handleCustomerSubscriptionDeleted,
} from "@/actions/buy-actions";
import { updateStripeConnectStatusAction } from "@/actions/user-actions";

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
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
      case "checkout.session.completed": {
        // const stripeSession = event.data.object as Stripe.Checkout.Session
        const session = await stripe.checkout.sessions.retrieve(
          event.data.object.id,
          { expand: ["line_items"] }
        );
        const stripeSession = session as Stripe.Checkout.Session;

        const orden = await handleCheckoutCompleted(stripeSession);

        console.log(orden);

        break;
      }
      case "invoice.paid": {
        console.log("invoice.paid");
        break;
      }
      case "customer.subscription.deleted": {
        const customer = event.data.object as Stripe.Customer.Shipping;

        handleCustomerSubscriptionDeleted(customer);
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        console.log(
          "customer.subscription.updated, customer.subscription.created"
        );
        break;
      }
      case "account.updated": {
        const account = event.data.object as Stripe.Account;

        const accountUpdate = await updateStripeConnectStatusAction(account);

        console.log("AccountLink update: ", accountUpdate);

        break;
      }

      // opcional: manejar invoice.payment_failed, customer.updated, etc
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
