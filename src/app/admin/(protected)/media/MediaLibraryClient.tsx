"use client";

import { useState } from "react";
import { MediaUploader } from "./MediaUploader";
import { MediaGrid } from "./MediaGrid";
import type { MediaItem } from "./types";

export function MediaLibraryClient({ initial }: { initial: MediaItem[] }) {
  const [items, setItems] = useState(initial);

  return (
    <div className="flex flex-col gap-6">
      <MediaUploader onUploaded={(item) => setItems((prev) => [item, ...prev])} />
      <MediaGrid
        items={items}
        onChange={(updated) => setItems((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))}
        onRemove={(id) => setItems((prev) => prev.filter((m) => m.id !== id))}
      />
    </div>
  );
}
