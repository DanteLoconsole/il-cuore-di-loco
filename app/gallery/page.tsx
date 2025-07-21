"use client";

import "react-image-gallery/styles/css/image-gallery.css";
import images from "@/app/gallery/images.json";
import ImageGallery from "react-image-gallery";


export default function GalleryPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-accent my-4 h-full max-w-full">
      <div className="w-[90%] max-w-5xl">
        <ImageGallery
          items={images}
          showBullets={true}
          showPlayButton={true}
          showIndex={true}
          showFullscreenButton={true}
          showNav={true}
          showThumbnails={true}
        />
        <p className="text-[0.8rem] text-[var(--main)]">
          Pictures by{" "}
          <a
            href="https://www.pregioimmobiliareitalia.it/"
            target="_blank"
            rel="noreferrer"
          >
            Pregio Immobiliare Italia
          </a>
        </p>
      </div>
    </div>
  );
}
