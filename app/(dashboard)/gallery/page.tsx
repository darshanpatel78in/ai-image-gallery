"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UploadZone from "@/components/gallery/UploadZone";
import ImageGrid from "@/components/gallery/ImageGrid";
import SearchBar from "@/components/gallery/SearchBar";
import Pagination from "@/components/gallery/Pagination";
import ImageModal from "@/components/gallery/ImageModal";
import { useUser } from "@/hooks/useUser";

export default function GalleryPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [q, setQ] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [similarTo, setSimilarTo] = useState<number | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [uploadKey, setUploadKey] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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

  const handleUploadComplete = () => {
    // Trigger re-render by updating a key
    setUploadKey(prev => prev + 1);
    // Reset to page 1 to see new uploads
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <UploadZone onUploadComplete={handleUploadComplete} />
      <SearchBar q={q} color={color} onChange={handleSearchChange} />
      <ImageGrid
        key={uploadKey}
        q={q}
        color={color}
        similarTo={similarTo}
        page={page}
        onFindSimilar={handleFindSimilar}
        onOpenImage={handleOpenImage}
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
