import { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Search, X } from "lucide-react";
import { formatDA, formatDate } from "@/lib/format";
import { STATUSES, STATUS_STYLES } from "@/lib/orderStatus";
import { WILAYAS } from "@/data/wilayas";
import { cn } from "@/lib/utils";

const INPUT =
  "h-11 w-full border border-brand-gold/35 bg-white px-3 font-body text-sm text-brand-blue placeholder:text-brand-blue/35 focus:border-brand-blue focus:outline-none";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("All");
  const [wilaya, setWilaya] = useState("");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const query = {};
    if (status !== "All") query.status = status;
    if (wilaya) query.wilaya_code = wilaya;
    try {
      const result = await base44.entities.Order.filter(query, {
        sort: "-created_date",
        limit: 100,
      });
      setOrders(Array.isArray(result) ? result : result?.items || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, wilaya]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((order) => {
      if (date) {
        const created = new Date(order.created_date).toISOString().slice(0, 10);
        if (created !== date) return false;
      }
      if (!q) return true;
      return (
        String(order.order_reference || "").toLowerCase().includes(q) ||
        String(order.customer_name || "").toLowerCase().includes(q) ||
        String(order.phone || "").includes(q)
      );
    });
  }, [orders, search, date]);

  const saveOrder = async (updates) => {
    if (!selected) return;
    setSaving(true);
    try {
      const updated = await base44.entities.Order.update(selected.id, updates);
      setSelected(updated);
      setOrders((current) => current.map((o) => (o.id === updated.id ? updated : o)));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <p className="eyebrow text-brand-blue/45">Orders</p>
      <h1 className="mt-3 font-heading text-3xl font-light text-brand-blue">
        {filtered.length} order{filtered.length === 1 ? "" : "s"}
      </h1>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-blue/40" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Reference, name or phone"
            aria-label="Search orders"
            className={cn(INPUT, "pl-9")}
          />
        </div>
        <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status" className={INPUT}>
          <option value="All">All statuses</option>
          {STATUSES.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <select value={wilaya} onChange={(event) => setWilaya(event.target.value)} aria-label="Filter by wilaya" className={INPUT}>
          <option value="">All wilayas</option>
          {WILAYAS.map((option) => (
            <option key={option.code} value={option.code}>{option.code} — {option.name}</option>
          ))}
        </select>
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} aria-label="Filter by date" className={INPUT} />
      </div>

      <div className="mt-6 overflow-x-auto border border-brand-gold/25 bg-white">
        {loading ? (
          <p className="p-8 text-center font-body text-sm text-brand-blue/50">Loading orders…</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center font-body text-sm text-brand-blue/50">
            No orders match these filters.
          </p>
        ) : (
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-brand-gold/25 font-body text-[0.6rem] uppercase tracking-[0.14em] text-brand-blue/45">
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Wilaya</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelected(order)}
                  className="cursor-pointer border-b border-brand-gold/10 font-body text-sm text-brand-blue/80 transition-colors hover:bg-brand-lavender/15"
                >
                  <td className="px-4 py-3 text-brand-blue">{order.order_reference}</td>
                  <td className="px-4 py-3">{order.customer_name}</td>
                  <td className="px-4 py-3">{order.phone}</td>
                  <td className="px-4 py-3">{order.wilaya_name}</td>
                  <td className="px-4 py-3">{order.items?.length || 0}</td>
                  <td className="px-4 py-3">{formatDA(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("border px-2 py-1 text-[0.6rem] uppercase tracking-[0.1em]", STATUS_STYLES[order.status] || "border-brand-gold/30 text-brand-blue/60")}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-brand-blue/50">{formatDate(order.created_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-brand-ink/40" onClick={() => setSelected(null)} aria-hidden="true" />
          <div className="relative h-full w-full max-w-xl overflow-y-auto bg-brand-cream p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow text-brand-gold">Order</p>
                <h2 className="mt-1 font-heading text-2xl text-brand-blue">{selected.order_reference}</h2>
                <p className="font-body text-xs text-brand-blue/50">{formatDate(selected.created_date)}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} aria-label="Close order" className="p-2 text-brand-blue/60">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="bg-white p-4">
                <p className="eyebrow text-brand-blue/40">Customer</p>
                <p className="mt-1 font-body text-sm text-brand-blue">{selected.customer_name}</p>
                <p className="font-body text-sm text-brand-blue/70">{selected.phone}</p>
              </div>
              <div className="bg-white p-4">
                <p className="eyebrow text-brand-blue/40">Delivery</p>
                <p className="mt-1 font-body text-sm text-brand-blue">
                  {selected.wilaya_code} — {selected.wilaya_name}
                </p>
                <p className="font-body text-sm text-brand-blue/70">{selected.commune}</p>
                <p className="font-body text-xs text-brand-blue/60">{selected.delivery_address}</p>
                {selected.delivery_instructions && (
                  <p className="mt-1 font-body text-xs italic text-brand-blue/50">
                    {selected.delivery_instructions}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 bg-white p-4">
              <p className="eyebrow text-brand-blue/40">Items</p>
              <ul className="mt-2 divide-y divide-brand-gold/15">
                {selected.items?.map((item, index) => (
                  <li key={index} className="py-2">
                    <div className="flex justify-between gap-3">
                      <p className="font-body text-sm text-brand-blue">
                        {item.product_name} × {item.quantity}
                      </p>
                      <p className="font-body text-sm text-brand-blue">
                        {item.price_on_request ? "On request" : formatDA(item.line_total)}
                      </p>
                    </div>
                    <p className="font-body text-xs uppercase tracking-[0.1em] text-brand-blue/45">
                      {[item.shape, item.size].filter(Boolean).join(" · ")}
                    </p>
                    {item.size_note && (
                      <p className="font-body text-xs text-brand-blue/55">{item.size_note}</p>
                    )}
                    {item.customization && (
                      <p className="font-body text-xs leading-relaxed text-brand-blue/55">{item.customization}</p>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-3 space-y-1 border-t border-brand-gold/20 pt-3 font-body text-sm">
                <div className="flex justify-between text-brand-blue/70">
                  <span>Subtotal</span><span>{formatDA(selected.subtotal)}</span>
                </div>
                <div className="flex justify-between text-brand-blue/70">
                  <span>Delivery</span>
                  <span>{selected.delivery_fee == null ? "To be confirmed" : formatDA(selected.delivery_fee)}</span>
                </div>
                <div className="flex justify-between font-medium text-brand-blue">
                  <span>Total</span><span>{formatDA(selected.total)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-white p-4">
              <label htmlFor="status" className="font-body text-xs text-brand-blue/50">Order status</label>
              <select
                id="status"
                value={selected.status}
                onChange={(event) => saveOrder({ status: event.target.value })}
                className="mt-1.5 h-11 w-full border border-brand-gold/35 bg-white px-3 font-body text-sm text-brand-blue focus:border-brand-blue focus:outline-none"
              >
                {STATUSES.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              <label htmlFor="notes" className="mt-4 block font-body text-xs text-brand-blue/50">
                Internal notes
              </label>
              <textarea
                id="notes"
                value={selected.internal_notes || ""}
                onChange={(event) => setSelected({ ...selected, internal_notes: event.target.value })}
                rows={3}
                placeholder="Only visible to the shop"
                className="mt-1.5 w-full border border-brand-gold/35 bg-white p-3 font-body text-sm text-brand-blue placeholder:text-brand-blue/35 focus:border-brand-blue focus:outline-none"
              />
              <button
                type="button"
                onClick={() => saveOrder({ internal_notes: selected.internal_notes || "" })}
                disabled={saving}
                className="mt-3 min-h-[44px] bg-brand-blue px-5 font-body text-[0.65rem] uppercase tracking-[0.16em] text-white disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save notes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}