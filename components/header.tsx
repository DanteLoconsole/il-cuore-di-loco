"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Info & boeken", href: "/info" },
  { name: "Galerij", href: "/gallery" },
  { name: "Verhaal", href: "/story" },
  { name: "Wat te doen?", href: "/activities" },
  { name: "Contact", href: "/contact" },
];

/** Animated-underline nav link (grows from the left on hover). */
const navLinkClass =
  "relative text-header/70 transition-colors duration-300 hover:text-header hover:no-underline! after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-main after:transition-all after:duration-300 hover:after:w-full";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-b-gray-500/30 bg-accent/70 text-header backdrop-blur-xl">
      <nav
        aria-label="Global"
        className="flex items-center justify-between px-6 py-3"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Il Cuore di Loco</span>
            <Image
              width={40}
              height={40}
              alt="Il Cuore di Loco"
              src="/logo_trans.svg"
              className="h-10 w-auto transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-header/70 transition-colors hover:text-main"
          >
            <span className="sr-only">Open menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-10">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className={navLinkClass}>
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link href="/login" className={navLinkClass}>
            Log in <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </nav>

      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50 bg-black/20" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-1.5 p-1.5"
            >
              <span className="sr-only">Il Cuore di Loco</span>
              <Image
                width={32}
                height={32}
                alt="Il Cuore di Loco"
                src="/logo_trans.svg"
                className="h-8 w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-header/70 transition-colors hover:text-main"
            >
              <span className="sr-only">Sluit menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-1 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-header transition-colors hover:bg-main/10 hover:text-main hover:no-underline!"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-header transition-colors hover:bg-main/10 hover:text-main hover:no-underline!"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
