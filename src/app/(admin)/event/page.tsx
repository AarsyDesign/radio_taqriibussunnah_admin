"use client";

import { FormEvent, useEffect, useState } from "react";
import { TextAreaField, TextField, ToggleField, SaveButton } from "@/components/form-fields";
import { ImagePreview } from "@/components/image-preview";
import { PageHeader } from "@/components/page-header";
import { createClient } from "@/lib/supabase/client";

type EventForm = {
  is_active: boolean;
  title: string;
  subtitle: string;
  speaker: string;
  date_text: string;
  time_text: string;
  location: string;
  description: string;
  image_url: string;
  button_text: string;
  button_url: string;
};

const emptyForm: EventForm = {
  is_active: false,
  title: "",
  subtitle: "",
  speaker: "",
  date_text: "",
  time_text: "",
  location: "",
  description: "",
  image_url: "",
  button_text: "",
  button_url: "",
};

function isValidUrl(value: string) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function EventPage() {
  const [id, setId] = useState<string | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      const { data } = await createClient()
        .from("radio_event_config")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setId(data.id);
        setForm({
          is_active: data.is_active,
          title: data.title ?? "",
          subtitle: data.subtitle ?? "",
          speaker: data.speaker ?? "",
          date_text: data.date_text ?? "",
          time_text: data.time_text ?? "",
          location: data.location ?? "",
          description: data.description ?? "",
          image_url: data.image_url ?? "",
          button_text: data.button_text ?? "",
          button_url: data.button_url ?? "",
        });
      }
      setLoading(false);
    }

    loadEvent();
  }, []);

  function update<K extends keyof EventForm>(key: K, value: EventForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (form.is_active && !form.title.trim()) {
      setError("Title wajib diisi ketika info event aktif.");
      return;
    }
    if (!isValidUrl(form.image_url ?? "") || !isValidUrl(form.button_url ?? "")) {
      setError("URL gambar atau tombol harus valid dan memakai http/https.");
      return;
    }

    setSaving(true);
    const payload = { ...form, updated_at: new Date().toISOString() };
    const supabase = createClient();
    const result = id
      ? await supabase.from("radio_event_config").update(payload).eq("id", id)
      : await supabase.from("radio_event_config").insert(payload).select("id").single();

    setSaving(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    if (!id && "data" in result && result.data) setId(result.data.id);
    setMessage("Info event berhasil disimpan.");
  }

  return (
    <>
      <PageHeader
        title="Info Dauroh / Event"
        description="Ubah banner informasi dauroh atau event. Gambar hanya memakai link online, tanpa upload."
      />

      {loading ? (
        <p className="text-sm text-[#65725b]">Memuat data...</p>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="space-y-4 rounded-lg border border-[#d8cdb4] bg-[#fbf8ef] p-4 shadow-sm">
            <ToggleField
              label="Aktifkan info event"
              checked={form.is_active}
              onChange={(value) => update("is_active", value)}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Title" name="title" value={form.title ?? ""} onChange={(value) => update("title", value)} />
              <TextField label="Subtitle" name="subtitle" value={form.subtitle ?? ""} onChange={(value) => update("subtitle", value)} />
              <TextField label="Pemateri" name="speaker" value={form.speaker ?? ""} onChange={(value) => update("speaker", value)} />
              <TextField label="Tanggal" name="date_text" value={form.date_text ?? ""} onChange={(value) => update("date_text", value)} />
              <TextField label="Waktu" name="time_text" value={form.time_text ?? ""} onChange={(value) => update("time_text", value)} />
              <TextField label="Lokasi" name="location" value={form.location ?? ""} onChange={(value) => update("location", value)} />
              <TextField label="Image URL" name="image_url" value={form.image_url ?? ""} onChange={(value) => update("image_url", value)} />
              <TextField label="Button URL" name="button_url" value={form.button_url ?? ""} onChange={(value) => update("button_url", value)} />
              <TextField label="Button Text" name="button_text" value={form.button_text ?? ""} onChange={(value) => update("button_text", value)} />
            </div>
            <TextAreaField label="Deskripsi" name="description" value={form.description ?? ""} onChange={(value) => update("description", value)} />
            {error ? <p className="text-sm text-[#9b3327]">{error}</p> : null}
            {message ? <p className="text-sm text-[#285c3a]">{message}</p> : null}
            <SaveButton loading={saving} />
          </section>

          <aside className="rounded-lg border border-[#d8cdb4] bg-[#fbf8ef] p-4 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-[#334d39]">Preview Gambar</p>
            <ImagePreview url={form.image_url ?? ""} />
          </aside>
        </form>
      )}
    </>
  );
}
