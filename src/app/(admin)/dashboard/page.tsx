"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { formatDateTime, latestDate } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import type { EventConfig, LiveConfig, ScheduleItem } from "@/lib/types";

export default function DashboardPage() {
  const [eventInfo, setEventInfo] = useState<EventConfig | null>(null);
  const [liveInfo, setLiveInfo] = useState<LiveConfig | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const supabase = createClient();
      const [eventResult, liveResult, scheduleResult] = await Promise.all([
        supabase
          .from("radio_event_config")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("radio_live_config")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("radio_schedule_items")
          .select("*")
          .order("sort_order", { ascending: true }),
      ]);

      setEventInfo(eventResult.data);
      setLiveInfo(liveResult.data);
      setSchedule(scheduleResult.data ?? []);
      setLoading(false);
    }

    loadDashboard();
  }, []);

  const updatedAt = latestDate([
    eventInfo?.updated_at,
    liveInfo?.updated_at,
    ...schedule.map((item) => item.updated_at),
  ]);

  const cards = [
    {
      label: "Info Dauroh / Event",
      value: eventInfo?.is_active ? "Aktif" : "Nonaktif",
      detail: eventInfo?.title || "Belum ada judul",
    },
    {
      label: "Info Kajian Live",
      value: liveInfo?.is_active ? "Aktif" : "Nonaktif",
      detail: liveInfo?.title || "Belum ada judul",
    },
    {
      label: "Jadwal Harian",
      value: `${schedule.length} item`,
      detail: `${schedule.filter((item) => item.is_active).length} aktif`,
    },
    {
      label: "Update Terakhir",
      value: formatDateTime(updatedAt),
      detail: "Zona waktu WIB",
    },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Ringkasan konten yang akan dibaca aplikasi Flutter melalui endpoint konfigurasi publik."
      />

      {loading ? (
        <p className="text-sm text-[#65725b]">Memuat dashboard...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <section
              key={card.label}
              className="rounded-lg border border-[#d8cdb4] bg-[#fbf8ef] p-4 shadow-sm"
            >
              <p className="text-sm font-medium text-[#65725b]">{card.label}</p>
              <p className="mt-3 text-2xl font-semibold text-[#203527]">
                {card.value}
              </p>
              <p className="mt-2 text-sm text-[#6f7f55]">{card.detail}</p>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
