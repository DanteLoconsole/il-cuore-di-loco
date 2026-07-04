import Script from "next/script";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Data from "@/app/data.json";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/sectionHeading";
import Reveal from "@/components/reveal";
import ScrollUp from "@/components/scrollUp";

export default function HomePage() {
  return (
    <div className="flex w-screen flex-col items-center text-center">
      {/* Hero */}
      <section className="relative flex h-screen w-full items-center justify-center overflow-hidden lg:items-start lg:justify-start">
        <Image
          src="/hero.jpg"
          alt="Uitzicht over Locorotondo"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Legibility overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40" />

        <div className="relative z-10 mx-4 rounded-[30px] border-4 border-main bg-accent/90 px-6 py-4 shadow-2xl backdrop-blur-sm sm:px-10 lg:mx-0 lg:mt-48 lg:ml-8">
          <h1 className="font-script text-[28pt] text-main sm:text-[34pt] md:text-[40pt]">
            Il Cuore di Loco
          </h1>
          <h2 className="font-script text-[12pt] text-main sm:text-[16pt] md:text-[20pt]">
            Jouw thuis in het hart van Puglia
          </h2>
        </div>

        <a
          href="#intro"
          aria-label="Scroll naar beneden"
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/90 transition-colors hover:text-white"
        >
          <ChevronDownIcon className="size-9 animate-bounce" />
        </a>
      </section>

      {/* Intro */}
      <section id="intro" className="w-full scroll-mt-20 py-20">
        <Reveal className="mx-auto max-w-3xl px-8">
          <SectionHeading>{Data.title}</SectionHeading>
          <div className="mt-8 space-y-6">
            {Data.p.map((item, index) => (
              <p key={index} className="text-[12pt] text-header/80 italic md:text-[14pt]">
                {item}
              </p>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Instagram */}
      <section className="w-full pb-20">
        <Reveal className="mx-auto flex w-[80vw] justify-center xl:w-[60vw]">
          <div className="w-full overflow-hidden rounded-2xl bg-white p-4 shadow-[0_2px_20px_rgba(0,0,0,0.15)]">
            <Script src="https://cdn.lightwidget.com/widgets/lightwidget.js" />
            <iframe
              title="Instagram"
              src="https://cdn.lightwidget.com/widgets/8ced8ffe07275bcd92b6256e9f70f430.html"
              className="w-full border-0 outline-0"
              scrolling="no"
            />
          </div>
        </Reveal>
      </section>

      {/* Newsletter */}
      <section className="w-full pb-24">
        <Reveal className="mx-auto w-full max-w-[600px] px-8">
          <SectionHeading divider={false}>Blijf op de hoogte</SectionHeading>
          <p className="mt-4 text-header/70">
            Schrijf je in op onze nieuwsbrief en mis niets.
          </p>
          <form className="mt-6 flex flex-col gap-4 text-left">
            <input
              type="text"
              placeholder="Naam"
              required
              className="rounded-md border border-header/20 bg-white p-3 text-[0.95rem] focus:border-main focus:outline-none"
            />
            <input
              type="email"
              placeholder="E-mailadres"
              required
              className="rounded-md border border-header/20 bg-white p-3 text-[0.95rem] focus:border-main focus:outline-none"
            />
            <Button type="submit" className="p-4">
              Inschrijven
            </Button>
          </form>
        </Reveal>
      </section>

      <ScrollUp />
    </div>
  );
}
