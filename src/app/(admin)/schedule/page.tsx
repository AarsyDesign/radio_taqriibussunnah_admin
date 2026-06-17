"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { SaveButton, TextAreaField, TextField, ToggleField } from "@/components/form-fields";
import { createClient } from "@/lib/supabase/client";
import type { ScheduleItem } from "@/lib/types";

type ScheduleForm = {
  id?: string;
  title: string;
  time_text: string;
  description: string;
  category: string;
  sort_order: string;
  is_active: boolean;
  is_live_slot: boolean;
};

const emptyForm: ScheduleForm = {
  title: "",
  time_text: "",
  description: "",
  category: "",
  sort_order: "0",
  is_active: true,
  is_live_slot: false,
};

function toForm(item: ScheduleItem): ScheduleForm {
  return {
    id: item.id,
    title: item.title,
    time_text: item.time_text,
    description: item.description ?? "",
    category: item.category ?? "",
    sort_order: String(item.sort_order),
    is_active: item.is_active,
    is_live_slot: item.is_live_slot,
  };
}

export default function SchedulePage() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [form, setForm] = useState<ScheduleForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadItems() {
    const { data } = await createClient()
      .from("radio_schedule_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    let active = true;

    async function loadInitialItems() {
      const { data } = await createClient()
        .from("radio_schedule_items")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (active) {
        setItems(data ?? []);
        setLoading(false);
      }
    }

    loadInitialItems();

    return () => {
      active = false;
    };
  }, []);

  function update<K extends keyof ScheduleForm>(key: K, value: ScheduleForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.title.trim() || !form.time_text.trim()) {
      setError("Title dan time_text wajib diisi.");
      return;
    }

    setSaving(true);
    const payload = {
      title: form.title.trim(),
      time_text: form.time_text.trim(),
      description: form.description.trim() || null,
      category: form.category.trim() || null,
      sort_order: Number.parseInt(form.sort_order, 10) || 0,
      is_active: form.is_active,
      is_live_slot: form.is_live_slot,
      updated_at: new Date().toISOString(),
    };

    const supabase = createClient();
    const result = form.id
      ? await supabase.from("radio_schedule_items").update(payload).eq("id", form.id)
      : await supabase.from("radio_schedule_items").insert(payload);

    setSaving(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }

    setForm(emptyForm);
    setMessage(form.id ? "Jadwal berhasil diperbarui." : "Jadwal berhasil ditambahkan.");
    await loadItems();
  }

  async function deleteItem(id: string) {
    const confirmed = window.confirm("Hapus item jadwal ini?");
    if (!confirmed) return;

    const { error: deleteError } = await createClient()
      .from("radio_schedule_items")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setForm((current) => (current.id === id ? emptyForm : current));
    await loadItems();
  }

  async function toggleActive(item: ScheduleItem) {
    setError("");
    setMessage("");

    const { error: updateError } = await createClient()
      .from("radio_schedule_items")
      .update({
        is_active: !item.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage(
      !item.is_active
        ? "Jadwal berhasil diaktifkan."
        : "Jadwal berhasil dinonaktifkan.",
    );
    await loadItems();
  }

  return (
    <>
      <PageHeader
        title="Jadwal Harian"
        description="Kelola jadwal yang ditampilkan aplikasi. Urutan mengikuti nilai sort_order dari kecil ke besar."
      />

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border border-[#d8cdb4] bg-[#fbf8ef] p-4 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-[#203527]">
            {form.id ? "Edit Jadwal" : "Tambah Jadwal"}
          </h3>
          <TextField label="Title" name="title" value={form.title} onChange={(value) => update("title", value)} required />
          <TextField label="Time Text" name="time_text" value={form.time_text} onChange={(value) => update("time_text", value)} required />
          <TextField label="Category" name="category" value={form.category} onChange={(value) => update("category", value)} />
          <TextField label="Sort Order" name="sort_order" type="number" value={form.sort_order} onChange={(value) => update("sort_order", value)} />
          <TextAreaField label="Description" name="description" value={form.description} onChange={(value) => update("description", value)} />
          <div className="grid gap-3 sm:grid-cols-2">
            <ToggleField label="Aktif" checked={form.is_active} onChange={(value) => update("is_active", value)} />
            <ToggleField label="Slot live" checked={form.is_live_slot} onChange={(value) => update("is_live_slot", value)} />
          </div>
          {error ? <p className="text-sm text-[#9b3327]">{error}</p> : null}
          {message ? <p className="text-sm text-[#285c3a]">{message}</p> : null}
          <div className="flex flex-wrap gap-2">
            <SaveButton loading={saving} label={form.id ? "Update" : "Tambah"} />
            {form.id ? (
              <button
                type="button"
                onClick={() => setForm(emptyForm)}
                className="rounded-md border border-[#c9b991] px-4 py-2 text-sm font-semibold text-[#47634d] transition hover:bg-[#efe4cd]"
              >
                Batal
              </button>
            ) : null}
          </div>
        </form>

        <section className="overflow-hidden rounded-lg border border-[#d8cdb4] bg-[#fbf8ef] shadow-sm">
          {loading ? (
            <p className="p-4 text-sm text-[#65725b]">Memuat jadwal...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead className="bg-[#efe4cd] text-[#334d39]">
                  <tr>
                    <th className="px-4 py-3">Urutan</th>
                    <th className="px-4 py-3">Waktu</th>
                    <th className="px-4 py-3">Judul</th>
                    <th className="px-4 py-3">Kategori</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-t border-[#e2d7bf]">
                      <td className="px-4 py-3">{item.sort_order}</td>
                      <td className="px-4 py-3 font-medium">{item.time_text}</td>
                      <td className="px-4 py-3">{item.title}</td>
                      <td className="px-4 py-3">{item.category || "-"}</td>
                      <td className="px-4 py-3">
                        {item.is_active ? "Aktif" : "Nonaktif"}
                        {item.is_live_slot ? " / Live" : ""}
                      </td>
                      <td className="space-x-2 px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggleActive(item)}
                          className="rounded-md border border-[#c9b991] px-3 py-1.5 text-sm font-medium text-[#47634d] hover:bg-[#efe4cd]"
                        >
                          {item.is_active ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setForm(toForm(item))}
                          className="rounded-md border border-[#c9b991] px-3 py-1.5 text-sm font-medium text-[#47634d] hover:bg-[#efe4cd]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteItem(item.id)}
                          className="rounded-md border border-[#cfa59a] px-3 py-1.5 text-sm font-medium text-[#9b3327] hover:bg-[#f3ddd8]"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
