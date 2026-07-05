"use client";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { storyPictures } from "@/lib/content";
import SectionHeading from "@/components/sectionHeading";
import ScrollUp from "@/components/scrollUp";

export default function StoryPage() {
  const t = useTranslations("story");
  const items = t.raw("items") as { date: string; sentence: string }[];

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-accent px-4 py-16">
      <SectionHeading className="mb-8">{t("heading")}</SectionHeading>

      <VerticalTimeline lineColor="#389f98">
        {items.map((entry, key) => (
          <VerticalTimelineElement
            key={key}
            contentStyle={{
              background: "white",
              border: "1px solid #e3e3e3",
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              color: "#389f98",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
            contentArrowStyle={{ borderRight: "7px solid white" }}
            date={entry.date}
            iconStyle={{
              background: "#389f98",
              backgroundImage: "url(/logo.svg)",
              backgroundSize: "cover",
              boxShadow: "0 0 0 4px #59c4bc",
            }}
            intersectionObserverProps={{
              rootMargin: "0px 0px -40px 0px",
              triggerOnce: false,
            }}
          >
            <p className="m-0! mb-4! text-center text-header/80">
              {entry.sentence}
            </p>
            <div className="w-full max-w-[300px] overflow-hidden rounded-xl">
              <Image
                src={storyPictures[key]}
                alt={t("imageAlt")}
                width={600}
                height={600}
                className="h-auto w-full object-cover"
              />
            </div>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>

      <ScrollUp />
    </div>
  );
}
