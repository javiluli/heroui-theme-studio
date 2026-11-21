import type { ComponentPropsWithoutRef } from "react";

/** Generic flex wrapper. Direction, alignment and gap stay at the call site. */
export function Flex({ children, className = "", ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div {...props} className={`flex min-w-0 ${className}`.trim()}>
      {children}
    </div>
  );
}
