import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

const FALLBACK = {
  announcement_text: "Orders are open ✦ Delivery available to all 69 wilayas",
  instagram_url: "https://www.instagram.com/nora_nailshop/",
  tiktok_url: "https://www.tiktok.com/@nora_nailshop",
};

export default function SiteLayout() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let active = true;
    base44.entities.StoreSettings.list("-created_date", 1)
      .then((rows) => {
        if (!active) return;
        const list = Array.isArray(rows) ? rows : rows?.items;
        setSettings(list?.[0] || FALLBACK);
      })
      .catch(() => {
        if (active) setSettings(FALLBACK);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-brand-cream">
      <AnnouncementBar text={settings?.announcement_text} />
      <Navbar />
      <main className="flex-1">
        <Outlet context={{ settings: settings || FALLBACK }} />
      </main>
      <Footer settings={settings || FALLBACK} />
      <CartDrawer />
    </div>
  );
}