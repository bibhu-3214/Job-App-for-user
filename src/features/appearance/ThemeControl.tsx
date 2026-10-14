import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

export const appearanceKey = "forma.appearance.v1";
export type Appearance = "light" | "dark" | "system";
export function parseAppearance(value: string | null | undefined): Appearance {
  return value === "light" || value === "dark" ? value : "system";
}
export function resolveAppearance(preference: Appearance, systemDark: boolean) {
  return preference === "system" ? (systemDark ? "dark" : "light") : preference;
}

export default function ThemeControl() {
  const [preference, setPreference] = useState<Appearance>(() =>
    parseAppearance(document.documentElement.dataset.appearance),
  );
  const [storageWarning, setStorageWarning] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const theme = resolveAppearance(preference, media.matches);
      document.documentElement.dataset.theme = theme;
      document.documentElement.dataset.appearance = preference;
      document.documentElement.style.colorScheme = theme;
      document.documentElement.style.backgroundColor =
        theme === "dark" ? "#10121c" : "#f7f8fa";
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", theme === "dark" ? "#10121c" : "#f7f8fa");
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [preference]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === appearanceKey || event.key === null) {
        setPreference(parseAppearance(event.newValue));
        setStorageWarning(false);
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function choose(value: Appearance) {
    setPreference(value);
    try {
      localStorage.setItem(appearanceKey, value);
      setStorageWarning(false);
    } catch {
      setStorageWarning(true);
    }
  }
  return (
    <div className="appearance">
      <div className="theme-switch" role="group" aria-label="Appearance">
        {(
          [
            ["light", Sun],
            ["dark", Moon],
            ["system", Monitor],
          ] as const
        ).map(([value, Icon]) => (
          <button
            key={value}
            type="button"
            aria-label={`${value[0].toUpperCase()}${value.slice(1)} theme`}
            aria-pressed={preference === value}
            title={`${value[0].toUpperCase()}${value.slice(1)} theme`}
            onClick={() => choose(value)}
          >
            <Icon size={16} aria-hidden="true" />
          </button>
        ))}
      </div>
      {storageWarning && (
        <span className="theme-warning" role="status">
          Theme changed for this visit; storage is unavailable.
        </span>
      )}
    </div>
  );
}
