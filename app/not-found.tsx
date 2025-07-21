export default function NotFoundPage() {
  return (
    <div className="flex flex-col justify-center items-center text-center m-8 bg-accent">
      <p className="text-base font-semibold text-[var(--main)]">404</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
        Page not found
      </h1>
      <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <a
          href="./"
          className="rounded-md bg-[var(--main)] px-3.5 py-2.5 text-sm font-semibold text-white! shadow-xs hover:bg-[var(--main-hover)] hover:no-underline!"
        >
          Go back home
        </a>
        <a
          href="https://github.com/DanteLoconsole/il-cuore-di-loco/issues"
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-gray-900"
        >
          Contact support <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  );
}
