"use client";

import { useState } from "react";
import { updateSetting } from "@/lib/admin/settings";
import { Store, ShoppingCart, Truck, Save, MapPin } from "lucide-react";

interface RestaurantInfo {
  name: string;
  line1: string;
  line2: string;
  phone: string;
  whatsapp: string;
}

interface SettingsFormProps {
  initialSettings: Record<string, unknown>;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [storeStatus, setStoreStatus] = useState(
    (initialSettings.store_status as { is_open: boolean; message: string }) || { is_open: true, message: "" }
  );
  const [onlineOrders, setOnlineOrders] = useState(
    (initialSettings.online_orders as { enabled: boolean; message: string }) || { enabled: true, message: "" }
  );
  const [delivery, setDelivery] = useState(
    (initialSettings.delivery as { enabled: boolean; message: string }) || { enabled: true, message: "" }
  );
  const [restaurant, setRestaurant] = useState<RestaurantInfo>(
    (initialSettings.restaurant_info as RestaurantInfo) || {
      name: "Laphing Daddy Kitchen",
      line1: "",
      line2: "",
      phone: "",
      whatsapp: "",
    }
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage("");
    try {
      await Promise.all([
        updateSetting("store_status", storeStatus),
        updateSetting("online_orders", onlineOrders),
        updateSetting("delivery", delivery),
        updateSetting("restaurant_info", restaurant),
      ]);
      setSaveMessage("Settings saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch {
      setSaveMessage("Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Store Status */}
      <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-[#E6DFD5]/40 pb-4">
          <div className="w-10 h-10 bg-[#6E1D25]/10 rounded-xl flex items-center justify-center shrink-0">
            <Store className="h-5 w-5 text-[#6E1D25]" />
          </div>
          <div>
            <h2
              className="text-xl font-bold text-[#1A1A1A]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Store Status
            </h2>
            <p className="text-xs text-[#7A7570] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
              Control whether your store is open or closed
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#F7F3EC]/50 border border-[#E6DFD5]/30 rounded-xl">
            <div>
              <div className="font-semibold text-[#1A1A1A] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                Store Open
              </div>
              <div className="text-xs text-[#7A7570]">
                Allow customers to browse and place orders
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={storeStatus.is_open}
                onChange={(e) => setStoreStatus({ ...storeStatus, is_open: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#E6DFD5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6E1D25]"></div>
            </label>
          </div>

          {!storeStatus.is_open && (
            <div className="flex flex-col gap-1.5 pt-2">
              <label className="block text-xs font-bold text-[#7A7570] uppercase tracking-wider">
                Closed Message
              </label>
              <input
                type="text"
                value={storeStatus.message}
                onChange={(e) => setStoreStatus({ ...storeStatus, message: e.target.value })}
                placeholder="We're currently closed. Please check back later."
                className="w-full bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#7A7570]/30 focus:outline-none focus:border-[#6E1D25]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Online Orders */}
      <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-[#E6DFD5]/40 pb-4">
          <div className="w-10 h-10 bg-[#6E1D25]/10 rounded-xl flex items-center justify-center shrink-0">
            <ShoppingCart className="h-5 w-5 text-[#6E1D25]" />
          </div>
          <div>
            <h2
              className="text-xl font-bold text-[#1A1A1A]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Online Orders
            </h2>
            <p className="text-xs text-[#7A7570] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
              Enable or disable online ordering functionality
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#F7F3EC]/50 border border-[#E6DFD5]/30 rounded-xl">
            <div>
              <div className="font-semibold text-[#1A1A1A] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                Online Orders Enabled
              </div>
              <div className="text-xs text-[#7A7570]">
                Allow customers to place orders through the website
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={onlineOrders.enabled}
                onChange={(e) => setOnlineOrders({ ...onlineOrders, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#E6DFD5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6E1D25]"></div>
            </label>
          </div>

          {!onlineOrders.enabled && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="text-orange-700 text-sm font-semibold mt-0.5">⚠️</div>
                <div>
                  <div className="text-orange-850 font-bold text-sm mb-1">
                    Checkout Disabled
                  </div>
                  <div className="text-orange-700 text-xs font-medium leading-relaxed">
                    When online orders are disabled, the checkout button will be hidden and customers will see: &ldquo;Currently accepting offline orders only.&rdquo;
                  </div>
                </div>
              </div>
            </div>
          )}

          {!onlineOrders.enabled && (
            <div className="flex flex-col gap-1.5 pt-2">
              <label className="block text-xs font-bold text-[#7A7570] uppercase tracking-wider">
                Custom Message
              </label>
              <input
                type="text"
                value={onlineOrders.message}
                onChange={(e) => setOnlineOrders({ ...onlineOrders, message: e.target.value })}
                placeholder="Currently accepting offline orders only. Call us at 9873052538"
                className="w-full bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#7A7570]/30 focus:outline-none focus:border-[#6E1D25]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Delivery */}
      <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-[#E6DFD5]/40 pb-4">
          <div className="w-10 h-10 bg-[#6E1D25]/10 rounded-xl flex items-center justify-center shrink-0">
            <Truck className="h-5 w-5 text-[#6E1D25]" />
          </div>
          <div>
            <h2
              className="text-xl font-bold text-[#1A1A1A]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Delivery
            </h2>
            <p className="text-xs text-[#7A7570] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
              Control delivery availability
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#F7F3EC]/50 border border-[#E6DFD5]/30 rounded-xl">
            <div>
              <div className="font-semibold text-[#1A1A1A] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                Delivery Enabled
              </div>
              <div className="text-xs text-[#7A7570]">
                Allow delivery orders
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={delivery.enabled}
                onChange={(e) => setDelivery({ ...delivery, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#E6DFD5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6E1D25]"></div>
            </label>
          </div>

          {!delivery.enabled && (
            <div className="flex flex-col gap-1.5 pt-2">
              <label className="block text-xs font-bold text-[#7A7570] uppercase tracking-wider">
                Disabled Message
              </label>
              <input
                type="text"
                value={delivery.message}
                onChange={(e) => setDelivery({ ...delivery, message: e.target.value })}
                placeholder="Delivery temporarily unavailable"
                className="w-full bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#7A7570]/30 focus:outline-none focus:border-[#6E1D25]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-[#E6DFD5]/40 pb-4">
          <div className="w-10 h-10 bg-[#6E1D25]/10 rounded-xl flex items-center justify-center shrink-0">
            <MapPin className="h-5 w-5 text-[#6E1D25]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Restaurant Pickup Address
            </h2>
            <p className="text-xs text-[#7A7570] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
              Shown to customers on their order confirmation page
            </p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { label: "Kitchen Name", key: "name" as keyof RestaurantInfo, placeholder: "Laphing Daddy Kitchen" },
            { label: "Address Line 1", key: "line1" as keyof RestaurantInfo, placeholder: "Shop / Building / Street" },
            { label: "Address Line 2", key: "line2" as keyof RestaurantInfo, placeholder: "City, State, Pincode" },
            { label: "Phone", key: "phone" as keyof RestaurantInfo, placeholder: "9667414181" },
            { label: "WhatsApp Number (with country code)", key: "whatsapp" as keyof RestaurantInfo, placeholder: "919667414181" },
          ].map(({ label, key, placeholder }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">{label}</label>
              <input
                type="text"
                value={restaurant[key]}
                onChange={(e) => setRestaurant({ ...restaurant, [key]: e.target.value })}
                placeholder={placeholder}
                className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-4">
        <div>
          {saveMessage && (
            <div className={`text-sm font-semibold ${saveMessage.includes("Error") ? "text-red-600" : "text-green-600"}`}>
              {saveMessage}
            </div>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#6E1D25] text-white font-bold px-6 py-3.5 rounded-xl transition-all disabled:opacity-50 shadow-sm"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
