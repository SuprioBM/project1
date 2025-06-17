import Link from "next/link";

export default function ConfirmationPage() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
      <p>Your order has been placed successfully.</p>
      <p>We have sent a confirmation to your email.</p>
      <Link href="/">
        <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Continue Shopping
        </button>
      </Link>
    </div>
  );
}
