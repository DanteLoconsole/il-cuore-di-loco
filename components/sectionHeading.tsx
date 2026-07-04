import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  children: React.ReactNode;
  className?: string;
  /** Hide the decorative divider below the title. */
  divider?: boolean;
};

/** Script-font section title with a decorative teal divider underneath. */
export default function SectionHeading({
  children,
  className,
  divider = true,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <h2 className="font-script text-3xl text-main md:text-4xl">{children}</h2>
      {divider && (
        <span
          aria-hidden="true"
          className="flex items-center gap-2 text-main"
        >
          <span className="h-px w-10 bg-main/40" />
          <span className="text-xl">&#10022;</span>
          <span className="h-px w-10 bg-main/40" />
        </span>
      )}
    </div>
  );
}
