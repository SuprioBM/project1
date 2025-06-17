import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// Handle GET and POST requests for checkout data
export async function GET() {
  const checkouts = await prisma.checkout.findMany();
  return NextResponse.json(checkouts);
}

export async function POST(request: Request) {
  try {
    const { cart, formData, paymentMethod } = await request.json();

    // Validate required fields
    if (!cart || !formData || !paymentMethod) {
      return NextResponse.json(
        { message: "Missing required data (cart, formData, or paymentMethod)" },
        { status: 400 }
      );
    }

    const { name, phone, email, address, districts, area, postalCode } =
      formData;

    // Create a new checkout entry
    const newCheckout = await prisma.checkout.create({
      data: {
        name,
        phone,
        email,
        address,
        districts,
        area,
        postalcode: postalCode,
        Payment: paymentMethod,
        products: cart,
        status: "pending",
      },
    });

    // Update product sizes' quantity
    for (const item of cart) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
        select: { size: true }, // size is assumed to be a JSON object
      });

      if (!product) {
        console.warn(`Product with id ${item.id} not found.`);
        continue;
      }
      console.log(product.size);
      
      const currentSizes = product.size;
      if (typeof currentSizes !== "object" || currentSizes === null) {
        console.warn(`Product size is not an object for product ${item.id}`);
        continue;
      }

      const updatedSizes = { ...(currentSizes as Record<string, number>) };

      const sizeKey = item.size;
      const qtyOrdered = item.quantity;

      if (updatedSizes[sizeKey] === undefined) {
        console.warn(`Size ${sizeKey} not found for product ${item.id}`);
        continue;
      }

      updatedSizes[sizeKey] = Math.max(
        Number(updatedSizes[sizeKey]) - Number(qtyOrdered),
        0
      );

      await prisma.product.update({
        where: { id: item.id },
        data: { size: updatedSizes },
      });
    }

    return NextResponse.json(newCheckout, { status: 201 });
  } catch (error) {
    console.error("Error creating checkout:", error);
    return NextResponse.json(
      { message: "Error creating checkout" },
      { status: 500 }
    );
  }
}
