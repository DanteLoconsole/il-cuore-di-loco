import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Compact brand button. Defaults to the teal brand style; pass `className`
 * to override. Renders a native <button>.
 */
function Button({
  className,
  type = "button",
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md bg-main px-5 py-3 font-medium text-white transition-colors hover:bg-main-hover disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Button };
