import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://astropunch.pro";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "AstroPunch Premium Report",
              description: "Complete astro-punch analysis with personalized advice and PDF",
            },
            unit_amount: priceId === "premium" ? 499 : 499,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}?premium=success`,
      cancel_url: `${baseUrl}?premium=cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
