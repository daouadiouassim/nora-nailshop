import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { fetchStoreSettings } from "@/lib/catalog";

const INPUT =
  "mt-1.5 h-11 w-full border border-brand-gold/35 bg-white px-3 font-body text-sm text-brand-blue placeholder:text-brand-blue/35 focus:border-brand-blue focus:outline-none";
const LABEL = "font-body text-xs text-brand-blue/55";

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchStoreSettings().then(setSettings).catch(() => setSettings(null));
  }, []);

  const update = (key, value) => {
    setSaved(false);
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        announcement_text: settings.announcement_text || "",
        instagram_url: settings.instagram_url || "",
        tiktok_url: settings.tiktok_url || "",
        instagram_username: settings.instagram_username || "",
        instagram_followers: Number(settings.instagram_followers) || 0,
        instagram_posts: Number(settings.instagram_posts) || 0,
        hero_image: settings.hero_image || "",
        about_text: settings.about_text || "",
        delivery_note: settings.delivery_note || "",
      };
      if (settings.id) {
        const updated = await base44.entities.StoreSettings.update(settings.id, payload);
        setSettings(updated);
      } else {
        const created = await base44.entities.StoreSettings.create(payload);
        setSettings(created);
      }
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <p className="font-body text-sm text-brand-blue/50">Loading settings…</p>;

  return (
    <div className="max-w-3xl">
      <p className="eyebrow text-brand-blue/45">Settings</p>
      <h1 className="mt-3 font-heading text-3xl font-light text-brand-blue">Store settings</h1>

      <div className="mt-7 space-y-4 border border-brand-gold/25 bg-white p-5 sm:p-7">
        <div>
          <label className={LABEL}>Announcement bar</label>
          <input value={settings.announcement_text || ""} onChange={(e) => update("announcement_text", e.target.value)} className={INPUT} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL}>Instagram URL</label>
            <input value={settings.instagram_url || ""} onChange={(e) => update("instagram_url", e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>TikTok URL</label>
            <input value={settings.tiktok_url || ""} onChange={(e) => update("tiktok_url", e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Instagram username</label>
            <input value={settings.instagram_username || ""} onChange={(e) => update("instagram_username", e.target.value)} className={INPUT} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Followers</label>
              <input
                type="number"
                min="0"
                value={settings.instagram_followers ?? ""}
                onChange={(e) => update("instagram_followers", e.target.value)}
                className={INPUT}
              />
            </div>
            <div>
              <label className={LABEL}>Posts</label>
              <input
                type="number"
                min="0"
                value={settings.instagram_posts ?? ""}
                onChange={(e) => update("instagram_posts", e.target.value)}
                className={INPUT}
              />
            </div>
          </div>
        </div>
        <div>
          <label className={LABEL}>Homepage hero image URL</label>
          <input value={settings.hero_image || ""} onChange={(e) => update("hero_image", e.target.value)} className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Brand / about text</label>
          <textarea
            rows={4}
            value={settings.about_text || ""}
            onChange={(e) => update("about_text", e.target.value)}
            className="mt-1.5 w-full border border-brand-gold/35 bg-white p-3 font-body text-sm text-brand-blue focus:border-brand-blue focus:outline-none"
          />
        </div>
        <div>
          <label className={LABEL}>Delivery note</label>
          <input value={settings.delivery_note || ""} onChange={(e) => update("delivery_note", e.target.value)} className={INPUT} />
        </div>

        <div className="flex items-center gap-4 border-t border-brand-gold/20 pt-4">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="min-h-[46px] bg-brand-blue px-6 font-body text-[0.65rem] uppercase tracking-[0.16em] text-white disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save settings"}
          </button>
          {saved && <span className="font-body text-sm text-brand-blue/60">Settings saved.</span>}
        </div>
      </div>
    </div>
  );
}