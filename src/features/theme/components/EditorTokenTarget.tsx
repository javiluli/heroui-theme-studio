import type { ComponentPropsWithoutRef } from "react";
import type { EditableThemeVariable } from "../token-descriptions";

export function EditorTokenTarget({
  variable, highlighted, className = "", ...props
}: ComponentPropsWithoutRef<"div"> & {
  variable: EditableThemeVariable;
  highlighted?: boolean;
}) {
  return (
    <div
      {...props}
      id={"theme-token-" + variable.slice(2)}
      data-highlighted={highlighted || undefined}
      className={`relative scroll-m-2 outline-current outline-offset-2 data-[highlighted]:z-10 data-[highlighted]:outline-2 data-[highlighted]:outline-solid ${className}`}
    />
  );
}
