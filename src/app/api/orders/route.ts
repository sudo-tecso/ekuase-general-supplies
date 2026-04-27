import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import { sendTicketEmail } from "@/lib/notifications";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { items, deliveryDetails, paymentMethod, totalAmount, deliveryFee } = body;

    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the Order
      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          totalAmount,
          deliveryFee,
          paymentMethod,
          status: paymentMethod === "TICKET" ? "TICKET_GENERATED" : "PENDING",
          deliveryAddress: deliveryDetails.address,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.price,
            })),
          },
        },
      });

      // 2. Handle Ticket Generation if needed
      if (paymentMethod === "TICKET") {
        const ticketCode = `BM-${nanoid(5).toUpperCase()}`;
        const qrCodeBase64 = await QRCode.toDataURL(ticketCode);
        
        const ticket = await tx.ticket.create({
          data: {
            orderId: order.id,
            ticketCode,
            qrCodeUrl: qrCodeBase64,
            status: "PENDING",
          },
        });

        // 3. Send Ticket Email (Non-blocking or handle error)
        try {
          await sendTicketEmail(session.user.email!, {
            ticketCode,
            id: order.id,
          });
        } catch (emailErr) {
          console.error("Failed to send ticket email:", emailErr);
        }

        return { order, ticket };
      }

      return { order };
    });

    return NextResponse.json({ orderId: result.order.id });
  } catch (error: any) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
