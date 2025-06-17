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
    console.log("Received data:", { cart, formData, paymentMethod });

    // Validate incoming data
    if (!cart || !formData || !paymentMethod) {
      return NextResponse.json(
        { message: "Missing required data (cart, formdata, or paymentMethod)" },
        { status: 400 }
      );
    }

    const { name, phone, email, address, districts, area, postalCode } =
      formData;
    console.log({ cart, formData, paymentMethod });

    // Create a new checkout entry in the database using Prisma
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

    // Update product sizes quantity based on the cart
    for (const item of cart) {
      // Fetch the product with its sizes
      const product = await prisma.product.findUnique({
        where: { id: item.id },
        select: { size: true },
      });

      if (!product) {
        console.warn(`Product with id ${item.id} not found.`);
        continue;
      }

      const currentSizes = product.size;
      if (typeof currentSizes !== "object" || currentSizes === null) {
        console.warn(`Product size is not an object for product ${item.id}`);
        continue;
      }

      const updatedSizes = { ...(currentSizes as Record<string, number>) };

      for (const [sizeKey, qtyOrdered] of Object.entries(item.size)) {
        if (updatedSizes[sizeKey] === undefined) {
          console.warn(`Size key ${sizeKey} not found for product ${item.id}`);
          continue;
        }
        updatedSizes[sizeKey] = Math.max(
          Number(updatedSizes[sizeKey]) - Number(qtyOrdered),
          0
        );
      }

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
