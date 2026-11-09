import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { formatDA, formatDate } from "@/lib/format";
import { STATUSES } from "@/lib/orderStatus";

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const [total, grouped, latest] = await Promise.all([
        base44.entities.Order.count(),
        base44.entities.Order.aggregate({ query: {}, groupBy: "status", sum: ["total"] }),
        base44.entities.Order.list("-created_date", 6),
      ]);
      if (!active) return;

      const rows = grouped?.rows || [];
      const byStatus = {};
      rows.forEach((row) => {
        byStatus[row.status] = { count: row.count, sum: row.sum_total || 0 };
      });
      const sales = rows.reduce((sum, row) => sum + (row.sum_total || 0), 0);

      setStats({ total, byStatus, sales });
      setRecent(Array.isArray(latest) ? latest : latest?.items || []);
    };

    load().catch(() => {
      if (active) setStats({ total: 0, byStatus: {}, sales: 0 });
    });

    return () => {
      active = false;
    };
  }, []);

  const cards = [
    { label: "Total orders", value: stats?.total ?? 0 },
    ...STATUSES.map((status) => ({
      label: status,
      value: stats?.byStatus?.[status]?.count || 0,
    })),
  ];

  return (
    <div>
      <p className="eyebrow text-brand-blue/45">Dashboard</p>
      <h1 className="mt-3 font-heading text-3xl font-light text-brand-blue">Store overview</h1>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="border border-brand-gold/30 bg-white p-5">
            <p className="font-body text-[0.62rem] uppercase tracking-[0.16em] text-brand-blue/45">
              {card.label}
            </p>
            <p className="mt-2 font-heading text-3xl text-brand-blue">{card.value}</p>
          </div>
        ))}
        <div className="border border-brand-blue bg-brand-blue p-5 text-white">
          <p className="font-body text-[0.62rem] uppercase tracking-[0.16em] text-white/50">
            Total sales
          </p>
          <p className="mt-2 font-heading text-3xl">{formatDA(stats?.sales || 0)}</p>
          <p className="mt-1 font-body text-[0.65rem] text-white/45">Based on recorded orders</p>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl text-brand-blue">Recent orders</h2>
          <Link
            to="/admin/orders"
            className="font-body text-[0.62rem] uppercase tracking-[0.16em] text-brand-blue/60 hover:text-brand-blue"
          >
            All orders
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="mt-4 border border-dashed border-brand-gold/40 bg-white/60 p-8 text-center font-body text-sm text-brand-blue/50">
            No orders yet. New orders appear here as soon as they are placed.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto border border-brand-gold/25 bg-white">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-brand-gold/25 font-body text-[0.6rem] uppercase tracking-[0.14em] text-brand-blue/45">
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Wilaya</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((order) => (
                  <tr key={order.id} className="border-b border-brand-gold/10 font-body text-sm text-brand-blue/80">
                    <td className="px-4 py-3">
                      <Link to="/admin/orders" className="hover:text-brand-blue">
                        {order.order_reference}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{order.customer_name}</td>
                    <td className="px-4 py-3">{order.wilaya_name}</td>
                    <td className="px-4 py-3">{formatDA(order.total)}</td>
                    <td className="px-4 py-3">{order.status}</td>
                    <td className="px-4 py-3 text-brand-blue/50">{formatDate(order.created_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}