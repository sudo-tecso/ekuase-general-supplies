import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

// GET /api/customer/profile — returns the logged-in user's profile fields
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, phone: true, address: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[GET /api/customer/profile]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/customer/profile — updates name, phone, and address for the logged-in user
export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      console.error("[PUT /api/customer/profile] Validation failed:", fieldErrors);
      return NextResponse.json(
        { error: "Validation failed", fieldErrors },
        { status: 422 }
      );
    }

    const { name, phone, address } = parsed.data;

    // Check if the phone number is already in use by a different user
    const existingPhone = await prisma.user.findFirst({
      where: { phone, NOT: { id: session.user.id } },
    });

    if (existingPhone) {
      return NextResponse.json(
        { error: "This phone number is already linked to another account." },
        { status: 409 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name, phone, address },
      select: { id: true, name: true, email: true, phone: true, address: true },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[PUT /api/customer/profile]", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
