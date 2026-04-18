"use client";

import { useState } from "react";
import Image from "next/image";
import type { ShopifyImage } from "@/types/shopify";

interface ProductGalleryProps {
  images: ShopifyImage[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0]);

  if (!images.length) {
    return (
      <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-surface-container-low flex items-center justify-center">
        <span className="text-on-surface-variant font-label text-sm">No visuals available</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-surface-container-low relative shadow-editorial">
        {activeImage ? (
          <Image
            src={activeImage.url}
            alt={activeImage.altText ?? title}
            fill
            priority
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-outline">
            Image not available
          </div>
        )}
        {/* Badge Placeholder - Could be made dynamic */}
        <div className="absolute top-6 left-6 bg-secondary text-on-secondary text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded-full">
          Verified Quality
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {images.slice(0, 4).map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(img)}
            className={[
              "aspect-square rounded-2xl overflow-hidden border-2 transition-all ring-offset-2 ring-offset-surface",
              activeImage?.url === img.url
                ? "border-primary ring-2 ring-primary/20"
                : "border-transparent opacity-70 hover:opacity-100 bg-surface-container-low"
            ].join(" ")}
          >
            <Image
              src={img.url}
              alt={`${title} view ${idx + 1}`}
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
        
        {/* If fewer than 4 images, we could show placeholders, but usually Shopify has enough */}
      </div>
    </div>
  );
}
