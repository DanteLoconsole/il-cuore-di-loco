import Link from "next/link";

type StatusPageProps = {
  code: string;
  title: string;
  description: string;
  homeLabel: string;
  supportLabel: string;
};

/** Shared layout for the 403 / 404 status screens. */
export default function StatusPage({
  code,
  title,
  description,
  homeLabel,
  supportLabel,
}: StatusPageProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center bg-accent px-6 py-16 text-center">
      <p className="font-semibold text-main">{code}</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl">
        {title}
      </h1>
      <p className="mt-6 max-w-xl text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
        {description}
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
        <Link
          href="/"
          className="rounded-md bg-main px-4 py-2.5 text-sm font-semibold text-white! shadow-xs transition-colors hover:bg-main-hover hover:no-underline!"
        >
          {homeLabel}
        </Link>
        <a
          href="https://github.com/DanteLoconsole/il-cuore-di-loco/issues"
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-gray-900"
        >
          {supportLabel} <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  );
}
