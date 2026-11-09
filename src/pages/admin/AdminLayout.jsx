import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Truck,
  Settings,
  LogOut,
  Store,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/delivery", label: "Delivery", icon: Truck },
  { to: "/admin/settings", label: "Store settings", icon: Settings },
];

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    base44.auth
      .me()
      .then((me) => active && setUser(me))
      .catch(() => active && setUser(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-blue">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/25 border-t-white" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream px-6">
        <div className="max-w-md text-center">
          <ShieldAlert className="mx-auto h-8 w-8 text-brand-gold" strokeWidth={1.3} />
          <h1 className="mt-5 font-heading text-2xl text-brand-blue">Admin access only</h1>
          <p className="mt-3 font-body text-sm leading-relaxed text-brand-blue/60">
            This area is reserved for the Nora Nailshop administrator. You are signed in as{" "}
            {user?.email || "an account without admin access"}.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex min-h-[48px] items-center justify-center border border-brand-blue/30 px-6 font-body text-[0.65rem] uppercase tracking-[0.18em] text-brand-blue"
            >
              Back to the store
            </Link>
            <button
              type="button"
              onClick={() => base44.auth.logout("/login")}
              className="inline-flex min-h-[48px] items-center justify-center bg-brand-blue px-6 font-body text-[0.65rem] uppercase tracking-[0.18em] text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const logout = async () => {
    await base44.auth.logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-brand-cream">
      <aside className="hidden w-64 shrink-0 flex-col bg-brand-blue px-5 py-7 lg:flex">
        <Link to="/admin" className="flex items-center gap-2">
          <img
            src="/assets/logos/n-monogram.png"
            alt=""
            aria-hidden="true"
            className="h-8 w-8 object-contain brightness-0 invert"
          />
          <span className="font-heading text-lg tracking-wide text-white">Nora Nailshop</span>
        </Link>
        <p className="mt-1 font-body text-[0.6rem] uppercase tracking-[0.22em] text-white/40">
          Atelier admin
        </p>

        <nav className="mt-10 flex flex-1 flex-col gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-3 font-body text-[0.72rem] uppercase tracking-[0.14em] transition-colors",
                  isActive ? "bg-white/12 text-white" : "text-white/60 hover:bg-white/5 hover:text-white",
                )
              }
            >
              <item.icon className="h-4 w-4" strokeWidth={1.5} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 font-body text-[0.68rem] uppercase tracking-[0.14em] text-white/50 hover:text-white"
        >
          <Store className="h-4 w-4" strokeWidth={1.5} /> View store
        </Link>
        <button
          type="button"
          onClick={logout}
          className="mt-1 flex items-center gap-2 px-3 py-2 text-left font-body text-[0.68rem] uppercase tracking-[0.14em] text-white/50 hover:text-white"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.5} /> Sign out
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 overflow-x-auto bg-brand-blue px-4 py-3 lg:hidden">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "whitespace-nowrap px-3 py-2 font-body text-[0.62rem] uppercase tracking-[0.12em]",
                  isActive ? "bg-white/15 text-white" : "text-white/60",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <main className="flex-1 px-4 py-8 sm:px-8">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
}