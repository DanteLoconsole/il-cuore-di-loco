"use client";

import Data from "@/app/story/data.json";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import Image from "next/image";
import ScrollUp from "@/components/scrollUp";

export default function StoryPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-accent p-4">
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-3xl sm:text-4xl text-[var(--header)] my-8 border-3 border-[var(--main)] border-dotted rounded-xl py-1 px-4">
          {Data.title}
        </h1>
        <VerticalTimeline lineColor="#389f98">
          {Data.story.map((sentence, key) => (
            <VerticalTimelineElement
              key={key}
              contentStyle={{
                background: "white",
                border: "1px solid #e3e3e3",
                color: "#389f98",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
              contentArrowStyle={{ borderRight: "7px solid white" }}
              date={sentence.date}
              iconStyle={{
                backgroundImage: "url(/logo.svg)",
                backgroundSize: "cover",
              }}
              intersectionObserverProps={{
                rootMargin: "0px 0px -40px 0px",
                triggerOnce: false,
              }}
            >
              <p className="m-0! mb-4! text-center">{sentence.sentence}</p>
              <div className="max-w-[300px]">
                <Image
                  src={sentence.picture}
                  alt="Story"
                  width={10000}
                  height={10000}
                />
              </div>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>
      <ScrollUp />
    </div>
  );
}
