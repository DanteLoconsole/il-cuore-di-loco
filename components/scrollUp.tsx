import ScrollToTop from "react-scroll-to-top";
import { ArrowUpCircleIcon } from "@heroicons/react/24/outline";

export default function ScrollUp() {
  return (
    <ScrollToTop
      smooth
      component={<ArrowUpCircleIcon className="text-white" />}
      className="bg-[var(--header-opacity)]! hover:bg-[var(--main)]! rounded-4xl! z-20!"
    />
  );
}
