"use client";

import { useState } from "react";

export function ImagePreview({ url }: { url: string }) {
  const [failedUrl, setFailedUrl] = useState("");

  if (!url || failedUrl === url) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-md border border-dashed border-[#c9b991] bg-[#f4ecd9] text-sm text-[#65725b]">
        Preview gambar belum tersedia
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt="Preview gambar"
      onError={() => setFailedUrl(url)}
      className="aspect-video w-full rounded-md border border-[#d8cdb4] object-cover"
    />
  );
}
