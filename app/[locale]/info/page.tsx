import {
  HomeModernIcon,
  CheckCircleIcon,
  BuildingOffice2Icon,
  CakeIcon,
  SparklesIcon,
  KeyIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SectionHeading from "@/components/sectionHeading";
import Reveal from "@/components/reveal";

// Positionally paired with the translated `info.facts` array.
const factIcons = [
  HomeModernIcon,
  CheckCircleIcon,
  BuildingOffice2Icon,
  CakeIcon,
  SparklesIcon,
  KeyIcon,
  ClockIcon,
];

export default async function InfoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("info");
  const facts = t.raw("facts") as { title: string; description: string }[];

  return (
    <div className="w-full bg-accent px-6 py-16">
      <SectionHeading className="mb-4">{t("heading")}</SectionHeading>

      <div className="mx-auto mb-10 max-w-2xl text-center text-header/80">
        <p>{t("intro")}</p>
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
        {facts.map((fact, index) => {
          const Icon = factIcons[index];
          return (
            <Reveal
              key={index}
              delay={(index % 4) * 100}
              className="flex gap-4 rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.10)]"
            >
              <Icon aria-hidden="true" className="h-7 w-7 shrink-0 text-main" />
              <div className="text-left">
                <h3 className="font-bold text-header">{fact.title}</h3>
                <p className="mt-1 text-sm text-header/70">{fact.description}</p>
              </div>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          href="/booking"
          className="rounded-md bg-main px-5 py-3 font-medium !text-white transition-colors hover:bg-main-hover hover:no-underline!"
        >
          {t("bookCta")}
        </Link>
      </div>
    </div>
  );
}
