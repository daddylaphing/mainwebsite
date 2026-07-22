"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import type { AddressSnapshot } from "@/types";

interface DeliveryBookingCardProps {
  orderId: string;
  orderNumber: string;
  shippingAddress: AddressSnapshot;
  total: number;
}

export function DeliveryBookingCard({ orderId, orderNumber, shippingAddress, total }: DeliveryBookingCardProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shipmentLink, setShipmentLink] = useState<string | null>(null);

  const handleCreateShipment = async () => {
    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const response = await fetch("/api/borzo/create-shipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          order_number: orderNumber,
          total,
          shipping_address: shippingAddress,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create shipment");
      }

      setStatus("Shipment created successfully.");
      setShipmentLink(data.shipment?.tracking_url || null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Shipment creation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 rounded-3xl border border-[#E6DFD5] bg-[#F7F3EC] p-5">
      <p className="text-sm font-semibold text-[#1A1A1A] mb-3">Delivery booking</p>
      <p className="text-xs text-[#7A7570] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
        The Borzo shipment integration is ready to book your delivery as soon as the restaurant confirms the order.
      </p>

      {status && (
        <div className="mt-4 rounded-2xl bg-green-50 border border-green-200 p-3 text-sm text-green-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          {status}
        </div>
      )}

      {shipmentLink ? (
        <a
          className="mt-4 inline-flex items-center justify-center rounded-full bg-[#1A1A1A] px-4 py-3 text-xs font-bold uppercase tracking-[0.32em] text-white hover:bg-[#6E1D25] transition-colors"
          href={shipmentLink}
          target="_blank"
          rel="noreferrer"
        >
          Track delivery
        </a>
      ) : (
        <button
          onClick={handleCreateShipment}
          disabled={loading}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-[#1A1A1A] px-4 py-3 text-xs font-bold uppercase tracking-[0.32em] text-white hover:bg-[#6E1D25] transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Booking delivery...
            </>
          ) : (
            "Book delivery with Borzo"
          )}
        </button>
      )}

      {error && (
        <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 p-3 text-sm text-red-800 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
