"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CheckCircle, Printer, Grass, FlaskConical } from "lucide-react";

export default function OrderSuccessPage() {
  const { state, clearCart, subtotal } = useCart();
  const [orderItems, setOrderItems] = useState([...state.items]);
  const [orderSubtotal, setOrderSubtotal] = useState(subtotal);
  const [orderNumber] = useState(`#SB-${Math.floor(1000 + Math.random() * 9000)}`);

  useEffect(() => {
    // Clear the cart only after we've captured the current state for the receipt
    if (state.items.length > 0) {
      clearCart();
    }
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount / 100);
  };

  const estimatedDelivery = "Oct 24 - Oct 26, 2024";

  return (
    <div className="bg-[#fff8f5] text-[#1f1b17] font-sans antialiased min-h-screen flex flex-col justify-center items-center py-24">
      <main className="w-full max-w-3xl mx-auto px-6 flex-grow flex flex-col items-center justify-center">
        {/* Success Icon */}
        <div className="mb-12 flex justify-center items-center w-24 h-24 rounded-full bg-[#1e5d4a] text-[#95d4bb]">
          <CheckCircle size={48} strokeWidth={2.5} />
        </div>

        {/* Headline */}
        <h1 className="font-semibold text-4xl text-[#004534] tracking-tight text-center mb-4">
          Order Placed Successfully!
        </h1>

        {/* Subheadline */}
        <p className="text-lg text-[#3f4944] text-center leading-relaxed mb-16 max-w-xl">
          Thank you for your purchase. We are preparing your agricultural
          supplies for dispatch.
        </p>

        {/* Order Details Card */}
        <div className="w-full bg-white rounded-lg p-10 mb-16 relative shadow-sm">
          <div className="absolute inset-0 border border-[#bec9c2] opacity-15 pointer-events-none rounded-lg"></div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-10 border-b border-[#f0e6e0]">
            <div>
              <span className="text-sm text-[#3f4944] uppercase tracking-widest block mb-1">
                Order Number
              </span>
              <span className="font-semibold text-2xl text-[#1f1b17]">
                {orderNumber}
              </span>
            </div>
            <div className="mt-6 md:mt-0 md:text-right">
              <span className="text-sm text-[#3f4944] uppercase tracking-widest block mb-1">
                Estimated Delivery
              </span>
              <span className="font-medium text-lg text-[#1f1b17]">
                {estimatedDelivery}
              </span>
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-6">
            <h3 className="font-semibold text-xl text-[#004534] mb-6">
              Order Summary
            </h3>

            {orderItems.length > 0 ? (
              orderItems.map((item) => (
                <div key={item.variantId} className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-[#f6ece6] rounded flex-shrink-0 flex items-center justify-center text-[#6f7973]">
                    {item.title.toLowerCase().includes("seed") ? (
                      <Grass size={24} />
                    ) : (
                      <FlaskConical size={24} />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-[#1f1b17]">{item.title}</h4>
                    <p className="text-sm text-[#3f4944]">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-semibold text-[#1f1b17]">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#3f4944] italic">No items found.</p>
            )}
          </div>

          {/* Total Amount Paid */}
          <div className="mt-10 pt-6 border-t border-[#f0e6e0] flex justify-between items-center">
            <span className="font-semibold text-lg text-[#1f1b17]">
              Total Amount Paid
            </span>
            <span className="font-semibold text-2xl text-[#004534]">
              {formatCurrency(orderSubtotal)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center mb-16">
          <Link
            href="/products"
            className="bg-[#004534] text-white font-medium px-8 py-4 rounded hover:bg-[#1e5d4a] transition-colors duration-200 text-center"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => window.print()}
            className="bg-[#f0e6e0] text-[#1f1b17] font-medium px-8 py-4 rounded hover:bg-[#eae1da] transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Printer size={20} />
            Print Invoice
          </button>
        </div>

        {/* Reassurance Text */}
        <div className="text-center bg-[#fcf2eb] p-6 rounded-lg w-full">
          <p className="text-sm text-[#3f4944] leading-relaxed">
            Need assistance with your order? Our agricultural experts are here
            to help.
            <br />
            Reach out to us at{" "}
            <span className="font-medium text-[#004534]">+91 98765 43210</span>{" "}
            or email{" "}
            <span className="font-medium text-[#004534]">
              support@basaveshwaraagro.com
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
