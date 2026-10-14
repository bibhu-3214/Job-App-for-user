import { test, expect } from "@playwright/test";
test.setTimeout(60000);

test("pre-paint theme, persistence, system changes and storage recovery", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  // Delay the app entry: theme and canvas must already be correct before React starts.
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/src/main.tsx", async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto("/", { waitUntil: "commit" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(
    await page
      .locator("html")
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe("rgb(16, 18, 28)");
  release();
  await expect(
    page.getByRole("button", { name: "System theme" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Light theme" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "System theme" }).click();
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.evaluate(() =>
    localStorage.setItem("forma.appearance.v1", "invalid"),
  );
  await page.reload();
  await expect(
    page.getByRole("button", { name: "System theme" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw Error("blocked");
    };
    Storage.prototype.setItem = () => {
      throw Error("blocked");
    };
  });
  await page.reload();
  await page.getByRole("button", { name: "Light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(
    page.getByText("Theme changed for this visit; storage is unavailable."),
  ).toBeVisible();
});

test("dark/light desktop/mobile screens, keyboard and reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({
    reducedMotion: "no-preference",
    colorScheme: "light",
  });
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.goto("/");
  // Motion is finite and actually applied to the chart in the animated mode.
  await expect(page.locator(".bar span").first()).toHaveCSS(
    "animation-name",
    "chart-reveal",
  );
  for (const theme of ["dark", "light"] as const) {
    await page
      .getByRole("button", {
        name: `${theme === "dark" ? "Dark" : "Light"} theme`,
      })
      .click();
    for (const size of ["desktop", "mobile"] as const) {
      await page.setViewportSize(
        size === "desktop"
          ? { width: 1440, height: 1050 }
          : { width: 390, height: 844 },
      );
      for (const route of ["/", "/candidates", "/intake"]) {
        await page.goto(route);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        await page.locator("main").evaluate(async (el) => {
          await Promise.all(
            el
              .getAnimations({ subtree: true })
              .map((a) => a.finished.catch(() => {})),
          );
        });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await page.screenshot({
          path: `artifacts/appearance/${theme}-${size}-${route === "/" ? "overview" : route.slice(1)}.png`,
          fullPage: true,
        });
        if (route === "/candidates") {
          await page.getByRole("button", { name: "View Avery Morgan" }).click();
          await page.getByRole("dialog").evaluate(async (el) => {
            await Promise.all(
              el
                .getAnimations({ subtree: true })
                .map((a) => a.finished.catch(() => {})),
            );
          });
          await page.screenshot({
            path: `artifacts/appearance/${theme}-${size}-dialog.png`,
            fullPage: false,
          });
          await page.keyboard.press("Escape");
        }
      }
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
  await page.getByRole("button", { name: "Dark theme" }).click();
  await page.goto("/");
  expect(
    await page
      .locator("main")
      .evaluate((el) => el.getAnimations({ subtree: true }).length),
  ).toBe(0);
  await expect(page.locator(".bar span").first()).toHaveCSS(
    "transform",
    "none",
  );
  await page.getByRole("button", { name: "Dark theme" }).focus();
  await page.keyboard.press("ArrowRight"); // Native buttons remain keyboard-operable.
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "System theme" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "System theme" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "View Jordan Ellis" }).click();
  await expect(page.getByRole("dialog")).toHaveCSS("animation-name", "none");
  await page.getByRole("button", { name: "Shortlist", exact: true }).click();
  await expect(
    page.getByRole("dialog").getByText("Shortlisted", { exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "artifacts/appearance/dark-mobile-reduced-motion-dialog.png",
    fullPage: false,
  });
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "View Jordan Ellis" }),
  ).toBeFocused();
  await page.reload();
  await page.getByRole("button", { name: "View Jordan Ellis" }).click();
  await expect(
    page.getByRole("dialog").getByText("Shortlisted", { exact: true }),
  ).toBeVisible();
});
