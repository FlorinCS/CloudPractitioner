import Stripe from "stripe";
import { handleSubscriptionChange, stripe } from "@/lib/payments/stripe";
import { promoteUserToPremium } from "@/lib/db/queries";
import { NextRequest, NextResponse } from "next/server";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed." },
      { status: 400 }
    );
  }
  const subscription = event.data.object as Stripe.Subscription;
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      const userId = paymentIntent.metadata?.userId;
      if (userId) {
        // call your function to promote user to Premium
        await promoteUserToPremium(userId);
      } else {
        console.warn("No userId in payment intent metadata.");
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
