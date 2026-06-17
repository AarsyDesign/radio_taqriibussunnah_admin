"use client";

export function TextField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#334d39]">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-md border border-[#d3c5a8] bg-white px-3 py-2 text-sm outline-none ring-[#7a9c62] transition focus:ring-2"
      />
    </label>
  );
}

export function TextAreaField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#334d39]">{label}</span>
      <textarea
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-1 w-full rounded-md border border-[#d3c5a8] bg-white px-3 py-2 text-sm outline-none ring-[#7a9c62] transition focus:ring-2"
      />
    </label>
  );
}

export function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 rounded-md border border-[#d8cdb4] bg-[#fbf8ef] px-3 py-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-[#285c3a]"
      />
      <span className="text-sm font-medium text-[#334d39]">{label}</span>
    </label>
  );
}

export function SaveButton({
  loading,
  label = "Simpan",
}: {
  loading: boolean;
  label?: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="rounded-md bg-[#285c3a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f472d] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Menyimpan..." : label}
    </button>
  );
}
