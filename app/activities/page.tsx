"use client";

import { useState } from "react";
import Data from "@/app/activities/data.json";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function ActivitiesPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % Data.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Data.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="flex grow flex-col justify-center items-center bg-accent w-full min-h-[140px]">
      <div
        className="flex grow flex-col justify-center items-center overflow-hidden w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${Data[currentIndex].image})` }}
      >
        <div className="absolute bg-accent h-[35%] min-h-[122px] w-[75%] sm:w-[60%] min-w-[180px] py-4 px-6 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.70)] text-center flex flex-col justify-between items-center text-[var(--header)] overflow-scroll">
          <h1 className="text-[18pt] sm:text-[22pt] md:text-[26pt] lg:text-[30pt] font-bold">
            {Data[currentIndex].title}
          </h1>
          <p className="text-[10pt] sm:text-[12pt] md:text-[13pt] lg:text-[14pt] my-2">
            {Data[currentIndex].description}
          </p>
          <div className="text-white my-1 sm:my-2 md:my-3">
            <a
              href="https://pasqua.viaggiareinpuglia.it/en/dettaglio-infopoint/info-point-locorotondo"
              target="_blank"
              rel="noreferrer"
              className="bg-[var(--main)] hover:bg-[var(--main-hover)] rounded-md p-2 sm:px-3 text-[10pt] sm:text-[12pt] no-underline!"
            >
              Lees meer
            </a>
          </div>
        </div>
        <div className="absolute flex justify-between w-[calc(75%+50px)] sm:w-[calc(60%+50px)] min-w-[230px] z-10">
          <button
            onClick={handlePrevious}
            className="bg-[var(--main)] hover:bg-[var(--main-hover)] size-[50px] border-none rounded-[50%] cursor-pointer text-[36px]"
          >
            <ChevronLeftIcon className="text-white" />
          </button>
          <button
            onClick={handleNext}
            className="bg-[var(--main)] hover:bg-[var(--main-hover)] size-[50px] border-none rounded-[50%] cursor-pointer text-[36px]"
          >
            <ChevronRightIcon className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
