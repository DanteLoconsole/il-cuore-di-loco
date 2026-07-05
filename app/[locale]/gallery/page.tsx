"use client";

import "react-image-gallery/styles/css/image-gallery.css";
import { useTranslations } from "next-intl";
import images from "./images.json";
import ImageGallery from "react-image-gallery";
import SectionHeading from "@/components/sectionHeading";

export default function GalleryPage() {
  const t = useTranslations("gallery");
  return (
    <div className="flex w-full flex-col items-center bg-accent px-6 py-16">
      <SectionHeading className="mb-10">{t("heading")}</SectionHeading>

      <div className="w-[90%] max-w-5xl rounded-2xl bg-white p-4 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
        <ImageGallery
          items={images}
          showBullets
          showPlayButton
          showIndex
          showFullscreenButton
          showNav
          showThumbnails
        />
        <p className="mt-3 text-center text-[0.8rem] text-main">
          {t("picturesBy")}{" "}
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
