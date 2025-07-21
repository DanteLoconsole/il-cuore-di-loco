import {
  BuildingOffice2Icon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

export default function ContactPage() {
  return (
    <div className="relative isolate flex flex-col justify-center items-center bg-accent">
      <div className="grid max-w-7xl grid-cols-1 lg:grid-cols-2">
        {/* Left side with contact info */}
        <div className="relative flex justify-center p-6 lg:static lg:p-8">
          <div className="flex flex-col justify-center text-center lg:text-start max-w-xl lg:mx-0 lg:max-w-lg">
            <h2 className="text-4xl font-semibold tracking-tight text-pretty text-[var(--header)] sm:text-5xl">
              Contacteer ons
            </h2>
            <p className="mt-6 text-lg/8 text-gray-600">
              Met vragen over boekingen of het verblijf, contacteer ons gerust.
            </p>
            <dl className="flex flex-col text-start mx-auto lg:mx-0 mt-10 space-y-4 text-base/7 text-[#333333b0]">
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Address</span>
                  <BuildingOffice2Icon
                    aria-hidden="true"
                    className="h-7 w-6 text-[var(--main)]"
                  />
                </dt>
                <dd>
                  <a
                    href="https://maps.app.goo.gl/HpkSJ7sM7pqrXifd6"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[var(--header)]! hover:underline-offset-6"
                  >
                    Via Giuseppe Verdi, 23
                    <br />
                    70010 Locorotondo BA, Italië
                  </a>
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Telephone</span>
                  <PhoneIcon
                    aria-hidden="true"
                    className="h-7 w-6 text-[var(--main)]"
                  />
                </dt>
                <dd>
                  <a
                    href="tel:+32474545777"
                    className="hover:text-[var(--header)]! hover:underline-offset-6"
                  >
                    +32 474 54 57 77
                  </a>
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Email</span>
                  <EnvelopeIcon
                    aria-hidden="true"
                    className="h-7 w-6 text-[var(--main)]"
                  />
                </dt>
                <dd>
                  <a
                    href="mailto:info@ilcuorediloco.it"
                    className="hover:text-[var(--header)]! hover:underline-offset-6"
                  >
                    info@ilcuorediloco.it
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        {/* Right side with map */}
        <div className="flex p-6 lg:p-8">
          <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.4416876300998!2d17.32488188806878!3d40.75230916138379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134653002b960eb9%3A0xef53facff404a54e!2sIl%20Cuore%20di%20Loco!5e0!3m2!1sen!2sbe!4v1751997914300!5m2!1sen!2sbe"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-square w-[435px] max-w-[80%] mx-auto rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.3)] focus:outline-none"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
