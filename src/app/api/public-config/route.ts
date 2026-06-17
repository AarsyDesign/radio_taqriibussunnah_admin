import { createPublicServerClient } from "@/lib/supabase/server";
import { latestDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createPublicServerClient();

    const [eventResult, liveResult, scheduleResult] = await Promise.all([
      supabase
        .from("radio_event_config")
        .select("*")
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("radio_live_config")
        .select("*")
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("radio_schedule_items")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);

    if (eventResult.error || liveResult.error || scheduleResult.error) {
      return Response.json(
        { error: "Failed to load public config." },
        { status: 500 },
      );
    }

    const schedule = scheduleResult.data ?? [];
    const updatedAt = latestDate([
      eventResult.data?.updated_at,
      liveResult.data?.updated_at,
      ...schedule.map((item) => item.updated_at),
    ]);

    return Response.json({
      eventInfo: eventResult.data,
      liveInfo: liveResult.data,
      schedule,
      updatedAt,
    });
  } catch {
    return Response.json(
      { error: "Public config is not configured." },
      { status: 500 },
    );
  }
}
