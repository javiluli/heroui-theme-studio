import type { ComponentPropsWithoutRef } from "react";

/** Generic grid wrapper. Each screen owns its responsive tracks and gaps. */
export function Grid({ children, className = "", ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div {...props} className={`grid min-w-0 ${className}`.trim()}>
      {children}
    </div>
  );
}
