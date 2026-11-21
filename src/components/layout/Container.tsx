import type { ComponentPropsWithoutRef } from "react";

/** Shared full-width gutters for the header and workspace. */
export function Container({ children, className = "", ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div {...props} className={`w-full px-4 lg:px-5 ${className}`.trim()}>
      {children}
    </div>
  );
}
