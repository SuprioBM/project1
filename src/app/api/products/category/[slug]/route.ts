import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> } // Awaiting params here
) {
  const { slug } = await params; // Awaiting the params Promise

  try {
    const products = await prisma.product.findMany({
      where: { category: slug.toLowerCase() },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
