"use client";

import { useState } from "react";
import UploadZone from "@/components/gallery/UploadZone";
import ImageGrid from "@/components/gallery/ImageGrid";
import SearchBar from "@/components/gallery/SearchBar";
import Pagination from "@/components/gallery/Pagination";
import ImageModal from "@/components/gallery/ImageModal";

export default function GalleryPage() {
  const [q, setQ] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [similarTo, setSimilarTo] = useState<number | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [refreshImages, setRefreshImages] = useState<(() => void) | null>(null);

  const handleSearchChange = (nextQ: string, nextColor: string) => {
    setQ(nextQ);
    setColor(nextColor);
    setPage(1);
    setSimilarTo(undefined);
  };

  const handleFindSimilar = (imageId: number) => {
    setSimilarTo(imageId);
    setPage(1);
  };

  const handleOpenImage = (image: any) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <div className="flex flex-col gap-6">
      <UploadZone onUploadComplete={() => refreshImages?.()} />
      <SearchBar q={q} color={color} onChange={handleSearchChange} />
      <ImageGrid
        q={q}
        color={color}
        similarTo={similarTo}
        page={page}
        onFindSimilar={handleFindSimilar}
        onOpenImage={handleOpenImage}
        onRefresh={setRefreshImages}
      />
      <Pagination page={page} onPageChange={handlePageChange} />
      <ImageModal
        image={selectedImage}
        open={isModalOpen}
        onClose={handleCloseModal}
        onFindSimilar={handleFindSimilar}
        onFilterByTag={(tag) => handleSearchChange(tag, color)}
        onFilterByColor={(c) => handleSearchChange(q, c)}
      />
    </div>
  );
}
