import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const signature = req.headers.get("x-paystack-signature");

  const body = await req.text();
  const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");

  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const reference = event.data.reference;
    // Extract orderId from reference if possible, or search by paystackRef
    // My reference format was `BM-${orderId}-${Date.now()}`
    const orderId = reference.split("-")[1];

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          paystackRef: reference,
        },
      });
    }
  }

  return NextResponse.json({ status: "success" });
}
