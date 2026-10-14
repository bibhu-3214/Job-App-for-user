import { beforeEach, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ThemeControl, {
  appearanceKey,
  parseAppearance,
  resolveAppearance,
} from "../src/features/appearance/ThemeControl";

beforeEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  document.documentElement.dataset.appearance = "system";
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
});
test("invalid preferences fall back to system; explicit choice wins over OS", () => {
  expect(parseAppearance("broken")).toBe("system");
  expect(parseAppearance(null)).toBe("system");
  expect(resolveAppearance("system", true)).toBe("dark");
  expect(resolveAppearance("system", false)).toBe("light");
  expect(resolveAppearance("light", true)).toBe("light");
  expect(resolveAppearance("dark", false)).toBe("dark");
});
test("choice updates theme and stores preference independently of candidate data", () => {
  localStorage.setItem("forma.candidates.v1", "untouched");
  render(<ThemeControl />);
  fireEvent.click(screen.getByRole("button", { name: "Light theme" }));
  expect(document.documentElement.dataset.theme).toBe("light");
  expect(screen.getByRole("button", { name: "Light theme" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(localStorage.getItem(appearanceKey)).toBe("light");
  expect(localStorage.getItem("forma.candidates.v1")).toBe("untouched");
});
test("blocked writes apply a usable theme and report persistence failure", () => {
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw Error("blocked");
  });
  render(<ThemeControl />);
  fireEvent.click(screen.getByRole("button", { name: "Light theme" }));
  expect(document.documentElement.dataset.theme).toBe("light");
  expect(screen.getByRole("status")).toHaveTextContent(
    "storage is unavailable",
  );
});
test("theme preference changes in another tab synchronize without touching records", () => {
  render(<ThemeControl />);
  fireEvent(
    window,
    new StorageEvent("storage", { key: appearanceKey, newValue: "light" }),
  );
  expect(document.documentElement.dataset.theme).toBe("light");
  fireEvent(window, new StorageEvent("storage", { key: null }));
  expect(document.documentElement.dataset.theme).toBe("dark");
});
