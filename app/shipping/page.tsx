import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy - Laphing Daddy",
  description: "Information about our delivery and shipping services.",
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#090909] pt-32 px-5 md:px-20 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1
          className="font-black text-5xl md:text-[64px] text-white mb-8 leading-[1.1]"
          style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.03em" }}
        >
          SHIPPING <span className="text-[#E7B52C]">POLICY</span>
        </h1>

        <div className="bg-[#141414] border border-white/[0.08] rounded-2xl p-8 md:p-12 space-y-8">
          <section>
            <h2
              className="font-bold text-2xl text-white mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              1. Delivery Areas
            </h2>
            <p className="text-[#C7BFB3] leading-relaxed">
              We currently deliver within select metro cities. Check availability at checkout by
              entering your pincode.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-2xl text-white mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              2. Processing Time
            </h2>
            <p className="text-[#C7BFB3] leading-relaxed">
              Orders are processed within 24 hours on business days. Same-day delivery available for
              orders placed before 12 PM in select areas.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-2xl text-white mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              3. Delivery Charges
            </h2>
            <p className="text-[#C7BFB3] leading-relaxed">
              Free delivery on orders above ₹500. Standard delivery charge of ₹50 applies for orders
              below minimum.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-2xl text-white mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              4. Temperature Control
            </h2>
            <p className="text-[#C7BFB3] leading-relaxed">
              All laphing products are delivered in insulated packaging to maintain freshness. Please
              refrigerate immediately upon receipt.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
