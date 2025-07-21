export default function LoginPage() {
  return (
    <div className="bg-accent w-full">
      <div className="text-center m-8">
        <p className="font-semibold text-[var(--main)]">403</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
          Pagina niet toegelaten
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
          Sorry, deze pagina zal beschikbaar zijn van zodra reserveren mogelijk
          is.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="./"
            className="rounded-md bg-[var(--main)] px-3.5 py-2.5 text-sm font-semibold text-white! shadow-xs hover:bg-[var(--main-hover)] hover:no-underline!"
          >
            Terug naar home
          </a>
          <a
            href="https://github.com/DanteLoconsole/il-cuore-di-loco/issues"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-gray-900"
          >
            Contacteer support <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
}
