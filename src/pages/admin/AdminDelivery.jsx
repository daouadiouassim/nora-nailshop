import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { fetchDeliverySettings, fetchStoreSettings } from "@/lib/catalog";

const INPUT =
  "h-10 w-24 border border-brand-gold/35 bg-white px-2 font-body text-sm text-brand-blue focus:border-brand-blue focus:outline-none";

export default function AdminDelivery() {
  const [rows, setRows] = useState([]);
  const [dirty, setDirty] = useState({});
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDeliverySettings(), fetchStoreSettings()])
      .then(([delivery, store]) => {
        setRows(delivery);
        setSettings(store);
      })
      .finally(() => setLoading(false));
  }, []);

  const update = (id, changes) => {
    setSaved(false);
    setDirty((current) => ({ ...current, [id]: { ...(current[id] || {}), ...changes } }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = Object.entries(dirty).map(([id, changes]) => {
        const patch = { id };
        if ("delivery_fee" in changes) {
          patch.delivery_fee =
            changes.delivery_fee === "" ? null : Number(changes.delivery_fee);
        }
        if ("is_available" in changes) patch.is_available = changes.is_available;
        return patch;
      });
      if (payload.length > 0) await base44.entities.DeliverySetting.bulkUpdate(payload);

      if (settings?.id) {
        await base44.entities.StoreSettings.update(settings.id, {
          default_delivery_fee:
            settings.default_delivery_fee === "" || settings.default_delivery_fee == null
              ? null
              : Number(settings.default_delivery_fee),
          free_delivery_threshold:
            settings.free_delivery_threshold === "" || settings.free_delivery_threshold == null
              ? null
              : Number(settings.free_delivery_threshold),
          delivery_note: settings.delivery_note || "",
        });
      }

      const refreshed = await fetchDeliverySettings();
      setRows(refreshed);
      setDirty({});
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="font-body text-sm text-brand-blue/50">Loading delivery settings…</p>;

  return (
    <div>
      <p className="eyebrow text-brand-blue/45">Delivery</p>
      <h1 className="mt-3 font-heading text-3xl font-light text-brand-blue">Fees by wilaya</h1>
      <p className="mt-2 max-w-xl font-body text-sm leading-relaxed text-brand-blue/60">
        Leave a fee empty when it is not confirmed — customers then see “Delivery fee will be
        confirmed after order submission”.
      </p>

      {settings && (
        <div className="mt-7 grid gap-4 border border-brand-gold/25 bg-white p-5 sm:grid-cols-3">
          <div>
            <label className="font-body text-xs text-brand-blue/55">Default fee (DA)</label>
            <input
              type="number"
              min="0"
              value={settings.default_delivery_fee ?? ""}
              onChange={(e) => {
                setSaved(false);
                setSettings({ ...settings, default_delivery_fee: e.target.value });
              }}
              className={`${INPUT} mt-1.5 w-full`}
              placeholder="Not set"
            />
          </div>
          <div>
            <label className="font-body text-xs text-brand-blue/55">Free delivery above (DA)</label>
            <input
              type="number"
              min="0"
              value={settings.free_delivery_threshold ?? ""}
              onChange={(e) => {
                setSaved(false);
                setSettings({ ...settings, free_delivery_threshold: e.target.value });
              }}
              className={`${INPUT} mt-1.5 w-full`}
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="font-body text-xs text-brand-blue/55">Delivery note shown at checkout</label>
            <input
              value={settings.delivery_note || ""}
              onChange={(e) => {
                setSaved(false);
                setSettings({ ...settings, delivery_note: e.target.value });
              }}
              className={`${INPUT} mt-1.5 w-full`}
            />
          </div>
        </div>
      )}

      <div className="mt-6 overflow-x-auto border border-brand-gold/25 bg-white">
        <table className="w-full min-w-[520px] text-left">
          <thead>
            <tr className="border-b border-brand-gold/25 font-body text-[0.6rem] uppercase tracking-[0.14em] text-brand-blue/45">
              <th className="px-4 py-3">Wilaya</th>
              <th className="px-4 py-3">Fee (DA)</th>
              <th className="px-4 py-3">Available</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const change = dirty[row.id] || {};
              const fee = "delivery_fee" in change ? change.delivery_fee : row.delivery_fee ?? "";
              const available = "is_available" in change ? change.is_available : row.is_available !== false;
              return (
                <tr key={row.id} className="border-b border-brand-gold/10 font-body text-sm text-brand-blue/80">
                  <td className="px-4 py-2">
                    <span className="mr-2 text-brand-blue/40">{row.wilaya_code}</span>
                    {row.wilaya_name}
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      value={fee}
                      onChange={(e) => update(row.id, { delivery_fee: e.target.value })}
                      placeholder="—"
                      aria-label={`Delivery fee for ${row.wilaya_name}`}
                      className={INPUT}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={available}
                      onChange={(e) => update(row.id, { is_available: e.target.checked })}
                      aria-label={`Delivery available to ${row.wilaya_name}`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="min-h-[46px] bg-brand-blue px-6 font-body text-[0.65rem] uppercase tracking-[0.16em] text-white disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save delivery settings"}
        </button>
        {saved && <span className="font-body text-sm text-brand-blue/60">Delivery settings saved.</span>}
      </div>
    </div>
  );
}