"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/event", label: "Info Dauroh" },
  { href: "/live", label: "Kajian Live" },
  { href: "/schedule", label: "Jadwal" },
  { href: "/preview-public-config", label: "Preview JSON" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-[#f8f3e7] text-[#1f2f24]">
      <aside className="border-b border-[#d8cdb4] bg-[#fbf8ef]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <Link href="/dashboard" className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6f7f55]">
              Radio Taqriibussunnah
            </p>
            <h1 className="text-xl font-semibold">Admin Konten</h1>
          </Link>

          <nav className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-[#285c3a] text-white"
                      : "text-[#47634d] hover:bg-[#e7dec9]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={signOut}
              className="rounded-md border border-[#c9b991] px-3 py-2 text-sm font-medium text-[#6a3f2e] transition hover:bg-[#efe4cd]"
            >
              Keluar
            </button>
          </nav>
        </div>
      </aside>
      <main className="mx-auto w-full max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
