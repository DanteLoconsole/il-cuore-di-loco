import Image from "next/image";
import Data from "@/app/activities/data.json";
import SectionHeading from "@/components/sectionHeading";
import Reveal from "@/components/reveal";
import ScrollUp from "@/components/scrollUp";

export default function ActivitiesPage() {
  return (
    <div className="w-full bg-accent px-6 py-16">
      <SectionHeading className="mb-12">Wat te doen?</SectionHeading>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Data.map((activity, index) => (
          <Reveal
            key={index}
            delay={(index % 3) * 100}
            className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300 hover:shadow-[0_8px_28px_rgba(0,0,0,0.22)]"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={activity.image}
                alt={activity.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6 text-left">
              <h3 className="text-lg font-bold text-header">{activity.title}</h3>
              <p className="mt-3 flex-1 text-sm text-header/70">
                {activity.description}
              </p>
              <a
                href="https://pasqua.viaggiareinpuglia.it/en/dettaglio-infopoint/info-point-locorotondo"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-fit rounded-md bg-main px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-main-hover hover:no-underline!"
              >
                Lees meer
              </a>
            </div>
          </Reveal>
        ))}
      </div>

      <ScrollUp />
    </div>
  );
}
