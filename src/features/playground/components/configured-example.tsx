import { useState, type ReactNode } from "react";
import { PlaygroundControls, PlaygroundPreview } from "./ComponentPlayground";
import { ControlSelect } from "./ControlSelect";
import { SIZES as sizeOptions } from "../options";
import { ControlSwitch } from "./ControlSwitch";

type Options = Record<string, readonly [string, ...string[]]>;
type Values<T extends Options> = { [K in keyof T]: T[K][number] };

/** Local exhibit state. Each sample assigns values only to documented native props. */
export function configuredExample<const T extends Options>(
  options: T,
  render: (values: Values<T>) => ReactNode,
) {
  const controls = (Object.keys(options) as (keyof T & string)[]).map((label) => ({
    label,
    options: options[label].map((key) => ({ key, label: sizeOptions.find((size) => size.key === key)?.label ?? key })),
  }));
  return function ConfiguredExample() {
    const [values, setValues] = useState(() => Object.fromEntries(
      controls.map(({ label, options }) => [label, options[0].key]),
    ) as Values<T>);
    return (
      <>
        {controls.length > 0 && (
          <PlaygroundControls>
            {controls.map(({ label, options }) => options.length === 2 && options.every(({ key }) => key === "on" || key === "off") ? (
              <ControlSwitch key={label} label={label} value={values[label] === "on"}
                onChange={(on) => setValues((current) => ({ ...current, [label]: on ? "on" : "off" }))} />
            ) : (
              <ControlSelect key={label} label={label} value={values[label]} options={options}
                onChange={(key) => setValues((current) => ({ ...current, [label]: key }))} />
            ))}
          </PlaygroundControls>
        )}
        <PlaygroundPreview>{render(values)}</PlaygroundPreview>
      </>
    );
  };
}

export const FIELD_VARIANTS = ["primary", "secondary"] as const;
export const FIELD_STATES = ["Normal", "Disabled", "Invalid"] as const;
export function fieldStateProps(state: (typeof FIELD_STATES)[number]) {
  return { isDisabled: state === "Disabled", isInvalid: state === "Invalid" };
}
export const DISABLED = ["off", "on"] as const;
export const SIZES = ["md", "sm", "lg"] as const;
export const SEMANTIC_COLORS = ["accent", "default", "success", "warning", "danger"] as const;
export const ORIENTATIONS = ["horizontal", "vertical"] as const;
