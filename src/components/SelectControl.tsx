import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";

/** Preserve the native picker and keyboard behavior, with one consistently inset chevron. */
export default function SelectControl(props: ComponentProps<"select">) {
  return (
    <span className="select-control">
      <select {...props} />
      <ChevronDown size={16} aria-hidden="true" focusable="false" />
    </span>
  );
}
