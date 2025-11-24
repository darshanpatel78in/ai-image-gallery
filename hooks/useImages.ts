"use client";

import { useEffect, useState, useCallback } from "react";

export interface GalleryImage {
  id: number;
  image_id: number;
  description: string | null;
  tags: string[];
  colors: string[];
  ai_processing_status: string;
  original_url: string;
  thumbnail_url: string;
}

export interface UseImagesParams {
  q?: string;
  color?: string;
  similarTo?: number;
  page?: number;
}

export function useImages(params: UseImagesParams) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const query = new URLSearchParams();
      if (params.q) query.set("q", params.q);
      if (params.color) query.set("color", params.color);
      if (params.similarTo != null)
        query.set("similarTo", String(params.similarTo));
      if (params.page) query.set("page", String(params.page));

      const res = await fetch(`/api/images/search?${query.toString()}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setImages(data.images ?? []);
      setPage(data.page ?? 1);
      setTotalPages(data.totalPages ?? 1);
      setLoading(false);
    }

    load();
  }, [params.q, params.color, params.similarTo, params.page, refreshKey]);

  const refresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return { images, page, totalPages, loading, refresh };
}
