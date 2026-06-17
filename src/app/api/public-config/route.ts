import {
  createPublicServerClient,
  createServiceServerClient,
} from "@/lib/supabase/server";
import { latestDate } from "@/lib/format";
import type { EventConfig, LiveConfig, ScheduleItem } from "@/lib/types";

export const dynamic = "force-dynamic";

const emptyEventInfo = {
  isActive: false,
  title: "",
  subtitle: "",
  speaker: "",
  dateText: "",
  timeText: "",
  location: "",
  description: "",
  imageUrl: "",
  buttonText: "",
  buttonUrl: "",
};

const emptyLiveInfo = {
  isActive: false,
  title: "",
  speaker: "",
  topic: "",
  timeText: "",
  description: "",
  imageUrl: "",
  showRedLiveIndicator: true,
  buttonText: "",
  buttonUrl: "",
};

function mapEventInfo(eventInfo: EventConfig | null) {
  if (!eventInfo) return emptyEventInfo;

  return {
    isActive: eventInfo.is_active,
    title: eventInfo.title ?? "",
    subtitle: eventInfo.subtitle ?? "",
    speaker: eventInfo.speaker ?? "",
    dateText: eventInfo.date_text ?? "",
    timeText: eventInfo.time_text ?? "",
    location: eventInfo.location ?? "",
    description: eventInfo.description ?? "",
    imageUrl: eventInfo.image_url ?? "",
    buttonText: eventInfo.button_text ?? "",
    buttonUrl: eventInfo.button_url ?? "",
  };
}

function mapLiveInfo(liveInfo: LiveConfig | null) {
  if (!liveInfo) return emptyLiveInfo;

  return {
    isActive: liveInfo.is_active,
    title: liveInfo.title ?? "",
    speaker: liveInfo.speaker ?? "",
    topic: liveInfo.topic ?? "",
    timeText: liveInfo.time_text ?? "",
    description: liveInfo.description ?? "",
    imageUrl: liveInfo.image_url ?? "",
    showRedLiveIndicator: liveInfo.show_red_live_indicator,
    buttonText: liveInfo.button_text ?? "",
    buttonUrl: liveInfo.button_url ?? "",
  };
}

function mapScheduleItem(item: ScheduleItem) {
  return {
    title: item.title,
    timeText: item.time_text,
    description: item.description ?? "",
    category: item.category ?? "",
    sortOrder: item.sort_order,
    isActive: item.is_active,
    isLiveSlot: item.is_live_slot,
  };
}

export async function GET() {
  try {
    const supabase = createServiceServerClient() ?? createPublicServerClient();

    const [eventResult, liveResult, scheduleResult] = await Promise.all([
      supabase
        .from("radio_event_config")
        .select(
          "id,is_active,title,subtitle,speaker,date_text,time_text,location,description,image_url,button_text,button_url,updated_at",
        )
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("radio_live_config")
        .select(
          "id,is_active,title,speaker,topic,time_text,description,image_url,show_red_live_indicator,button_text,button_url,updated_at",
        )
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("radio_schedule_items")
        .select(
          "id,title,time_text,description,category,sort_order,is_active,is_live_slot,created_at,updated_at",
        )
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
      eventInfo: mapEventInfo(eventResult.data),
      liveInfo: mapLiveInfo(liveResult.data),
      schedule: schedule.map(mapScheduleItem),
      updatedAt,
    });
  } catch {
    return Response.json(
      { error: "Public config is not configured." },
      { status: 500 },
    );
  }
}
