export type EventConfig = {
  id: string;
  is_active: boolean;
  title: string | null;
  subtitle: string | null;
  speaker: string | null;
  date_text: string | null;
  time_text: string | null;
  location: string | null;
  description: string | null;
  image_url: string | null;
  button_text: string | null;
  button_url: string | null;
  updated_at: string;
};

export type LiveConfig = {
  id: string;
  is_active: boolean;
  title: string | null;
  speaker: string | null;
  topic: string | null;
  time_text: string | null;
  description: string | null;
  image_url: string | null;
  show_red_live_indicator: boolean;
  button_text: string | null;
  button_url: string | null;
  updated_at: string;
};

export type ScheduleItem = {
  id: string;
  title: string;
  time_text: string;
  description: string | null;
  category: string | null;
  sort_order: number;
  is_active: boolean;
  is_live_slot: boolean;
  created_at: string;
  updated_at: string;
};

export type PublicEventInfo = {
  isActive: boolean;
  title: string;
  subtitle: string;
  speaker: string;
  dateText: string;
  timeText: string;
  location: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonUrl: string;
};

export type PublicLiveInfo = {
  isActive: boolean;
  title: string;
  speaker: string;
  topic: string;
  timeText: string;
  description: string;
  imageUrl: string;
  showRedLiveIndicator: boolean;
  buttonText: string;
  buttonUrl: string;
};

export type PublicScheduleItem = {
  title: string;
  timeText: string;
  description: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
  isLiveSlot: boolean;
};

export type PublicConfig = {
  eventInfo: PublicEventInfo;
  liveInfo: PublicLiveInfo;
  schedule: PublicScheduleItem[];
  updatedAt: string | null;
};
