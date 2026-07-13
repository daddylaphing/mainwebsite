import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy - Laphing Daddy",
  description: "Information about our delivery and shipping services.",
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-28 md:pt-36 px-5 md:px-20 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1
          className="font-bold text-4xl md:text-[56px] text-[#1A1A1A] mb-8 leading-none"
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.03em" }}
        >
          DELIVERY & <span className="text-[#D4A843] italic font-light">SHIPPING</span>
        </h1>

        <div className="bg-white border border-[rgba(26,26,26,0.08)] p-8 md:p-12 space-y-8">
          <section>
            <h2
              className="font-bold text-xl text-[#1A1A1A] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              1. Delivery Areas
            </h2>
            <p className="text-[#7A7570] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              We currently deliver within Delhi, Noida, Gurgaon, and Ghaziabad. Delivery feasibility will be evaluated during your checkout routing.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-xl text-[#1A1A1A] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              2. Processing Time
            </h2>
            <p className="text-[#7A7570] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Our kits are freshly prepared on the day of delivery. Booking slot details and dispatch timings are coordinated strictly during our booking window (3:00 PM – 6:00 PM).
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-xl text-[#1A1A1A] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              3. Delivery Logistics
            </h2>
            <p className="text-[#7A7570] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Orders are dispatched via customer self-booked portals (Uber, Rapido, Porter, or Uncle Delivery). Live location and delivery quotes are shared directly with the customer.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-xl text-[#1A1A1A] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              4. Temperature Control
            </h2>
            <p className="text-[#7A7570] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              All laphing starch sheets and spices are securely packed to maintain peak taste quality. We strongly recommend storing starch sheets in the refrigerator immediately after receiving.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
