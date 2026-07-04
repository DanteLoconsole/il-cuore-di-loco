"use client";

import Data from "@/app/story/data.json";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import Image from "next/image";
import SectionHeading from "@/components/sectionHeading";
import ScrollUp from "@/components/scrollUp";

export default function StoryPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-accent px-4 py-16">
      <SectionHeading className="mb-8">{Data.title}</SectionHeading>

      <VerticalTimeline lineColor="#389f98">
        {Data.story.map((sentence, key) => (
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
            date={sentence.date}
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
              {sentence.sentence}
            </p>
            <div className="w-full max-w-[300px] overflow-hidden rounded-xl">
              <Image
                src={sentence.picture}
                alt="Story"
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
