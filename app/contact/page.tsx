import {
  BuildingOffice2Icon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

const details = [
  {
    label: "Address",
    icon: BuildingOffice2Icon,
    href: "https://maps.app.goo.gl/HpkSJ7sM7pqrXifd6",
    external: true,
    content: (
      <>
        Via Giuseppe Verdi, 23
        <br />
        70010 Locorotondo BA, Italië
      </>
    ),
  },
  {
    label: "Telephone",
    icon: PhoneIcon,
    href: "tel:+32474545777",
    external: false,
    content: "+32 474 54 57 77",
  },
  {
    label: "Email",
    icon: EnvelopeIcon,
    href: "mailto:info@ilcuorediloco.it",
    external: false,
    content: "info@ilcuorediloco.it",
  },
];

export default function ContactPage() {
  return (
    <div className="flex w-full items-center justify-center bg-accent px-6 py-16">
      <div className="grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
        {/* Contact info */}
        <div className="flex flex-col text-center lg:text-start">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-header sm:text-5xl">
            Contacteer ons
          </h2>
          <p className="mt-6 text-lg/8 text-gray-600">
            Met vragen over boekingen of het verblijf, contacteer ons gerust.
          </p>
          <dl className="mx-auto mt-10 flex flex-col space-y-5 text-start text-base/7 text-header/70 lg:mx-0">
            {details.map((item) => (
              <div key={item.label} className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">{item.label}</span>
                  <item.icon aria-hidden="true" className="h-7 w-6 text-main" />
                </dt>
                <dd>
                  <a
                    href={item.href}
                    {...(item.external
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                    className="transition-colors hover:text-header!"
                  >
                    {item.content}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Map */}
        <div className="flex justify-center lg:justify-end">
          <iframe
            title="Kaart"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.4416876300998!2d17.32488188806878!3d40.75230916138379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134653002b960eb9%3A0xef53facff404a54e!2sIl%20Cuore%20di%20Loco!5e0!3m2!1sen!2sbe!4v1751997914300!5m2!1sen!2sbe"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="aspect-square w-full max-w-[435px] rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.3)] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
