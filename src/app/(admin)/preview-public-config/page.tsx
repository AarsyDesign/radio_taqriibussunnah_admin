"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import type { PublicConfig } from "@/lib/types";

export default function PreviewPublicConfigPage() {
  const [config, setConfig] = useState<PublicConfig | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadConfig() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/public-config", { cache: "no-store" });
      if (!response.ok) throw new Error("Gagal membaca endpoint publik.");
      setConfig(await response.json());
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConfig();
  }, []);

  return (
    <>
      <PageHeader
        title="Preview Public Config"
        description="Output JSON read-only yang akan dibaca aplikasi Flutter dari GET /api/public-config."
      />

      <section className="rounded-lg border border-[#d8cdb4] bg-[#fbf8ef] p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <code className="rounded-md bg-[#efe4cd] px-3 py-2 text-sm text-[#334d39]">
            GET /api/public-config
          </code>
          <button
            type="button"
            onClick={loadConfig}
            className="rounded-md border border-[#c9b991] px-3 py-2 text-sm font-medium text-[#47634d] transition hover:bg-[#efe4cd]"
          >
            Refresh
          </button>
        </div>

        {loading ? <p className="text-sm text-[#65725b]">Memuat JSON...</p> : null}
        {error ? <p className="text-sm text-[#9b3327]">{error}</p> : null}
        {config ? (
          <pre className="max-h-[70vh] overflow-auto rounded-md bg-[#203527] p-4 text-xs leading-6 text-[#f8f3e7]">
            {JSON.stringify(config, null, 2)}
          </pre>
        ) : null}
      </section>
    </>
  );
}
