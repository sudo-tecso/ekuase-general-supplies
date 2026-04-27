import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { verifyPaystackTransaction } from "@/lib/paystack";
import { sendOrderConfirmationEmail } from "@/lib/notifications";

export async function POST(req: Request, { params }: { params: { orderId: string } }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { reference } = await req.json();
    const verification = await verifyPaystackTransaction(reference);

    if (verification.data.status === "success") {
      const order = await prisma.order.update({
        where: { id: params.orderId },
        data: {
          status: "PAID",
          paystackRef: reference,
        },
      });

      // Send confirmation email
      try {
        await sendOrderConfirmationEmail(session.user.email!, order);
      } catch (e) {
        console.error("Confirmation email failed:", e);
      }

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
