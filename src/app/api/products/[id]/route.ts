import { NextRequest, NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

// GET /api/products/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT /api/products/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, description, price, link, category, size, image } = body;

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price,
        link,
        category,
        size,
        image,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE /api/products/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("DELETE /api/products/[id] params:", params);
  
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
