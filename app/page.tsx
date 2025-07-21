"use client";

import { Button } from "@/components/ui/button";
import Script from "next/script";
import Image from "next/image";
import Data from "@/app/data.json";
import ScrollUp from "@/components/scrollUp";

export default function HomePage() {
  return (
    <div className="text-center flex flex-col items-center justify-center w-screen">
      <section className="h-screen w-full bg-cover bg-center flex justify-center items-start sm:justify-start">
        <Image
          src="/hero.jpg"
          alt="Hero Image"
          className="absolute right-0 inset-0 object-cover w-full h-full object-center"
          width={1920}
          height={1080}
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playwrite+HR+Lijeva&display=swap"
          rel="stylesheet"
        />
        <div
          className="z-5 [font-optical-sizing:auto] bg-accent rounded-[30px] border-[var(--main)] border-5 mt-[4rem] sm:ml-[1rem] px-[1rem] sm:px-[2rem] text-[var(--main)]"
          style={{ fontFamily: "'Playwrite HR Lijeva', cursive" }}
        >
          <h1 className="text-[28pt] sm:text-[32pt] md:text-[36pt] lg:text-[40pt]">
            Il Cuore di Loco
          </h1>
          <h2 className="text-[12pt] sm:text-[14pt] md:text-[16pt] lg:text-[20pt] mb-[0.5rem]">
            Jouw thuis in het hart van Puglia
          </h2>
        </div>
      </section>

      <section className="-mt-4">
        <div className="mx-12 md:mx-32 text-[var(--main)]">
          <h2
            className="text-[24pt] md:text-[28pt]"
            style={{ fontFamily: "'Playwrite HR Lijeva', cursive" }}
          >
            {Data.title}
          </h2>
          <p className="text-[40px] md:text-[50px] -mb-6">~</p>
          {Data.p.map((item, index) => (
            <p key={index} className="text-[12pt] md:text-[14pt] italic my-6">
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-row justify-center w-[80vw] xl:w-[60vw] border-0 rounded-[15px] shadow-[0_2px_12px_rgba(0,0,0,0.4)] bg-white">
          <Script src="https://cdn.lightwidget.com/widgets/lightwidget.js" />
          <iframe
            src="https://cdn.lightwidget.com/widgets/8ced8ffe07275bcd92b6256e9f70f430.html"
            className="w-full m-4 border-0 outline-0"
            scrolling="no"
          />
        </div>
      </section>

      <section className="m-16 text-[var(--header)]">
        <div className="w-full max-w-[600px] text-[1rem] sm:text-[1.2rem]">
          <p className="font-bold">
            Op de hoogte blijven via onze nieuwsletter?
          </p>
          <p className="">Schrijf je hier in.</p>
          <form className="flex flex-col mt-4 gap-4">
            <input
              type="text"
              placeholder="Naam"
              required
              className="p-2 sm:p-3 border border-[var(--header-opacity)] rounded-xs focus:outline-none bg-white text-[0.8rem] sm:text-[1rem]"
            />
            <input
              type="email"
              placeholder="E-mailadres"
              required
              className="p-2 sm:p-3 border border-[var(--header-opacity)] rounded-xs focus:outline-none bg-white text-[0.8rem] sm:text-[1rem]"
            />
            <Button
              className="bg-[var(--main)] hover:bg-[var(--header)] rounded-xs p-4 sm:p-6 text-[0.8rem] sm:text-[1rem] text-white"
              type="submit"
            >
              Inschrijven
            </Button>
          </form>
        </div>
      </section>
      <ScrollUp />
    </div>
  );
}
