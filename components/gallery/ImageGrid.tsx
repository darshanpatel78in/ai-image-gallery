"use client";

import ImageCard from "./ImageCard";
import Skeleton from "@/components/ui/Skeleton";
import { useImages } from "@/hooks/useImages";

interface ImageGridProps {
  q: string;
  color: string;
  similarTo?: number;
  page: number;
  onFindSimilar: (imageId: number) => void;
  onOpenImage: (image: any) => void;
}

export default function ImageGrid({
  q,
  color,
  similarTo,
  page,
  onFindSimilar,
  onOpenImage,
}: ImageGridProps) {
  const { images, loading } = useImages({ q, color, similarTo, page });

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-video w-full" />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        No images yet. Upload something to get started.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {images.map((img) => (
        <ImageCard
          key={img.id}
          image={img}
          onFindSimilar={onFindSimilar}
          onOpen={() => onOpenImage(img)}
        />
      ))}
    </div>
  );
}
