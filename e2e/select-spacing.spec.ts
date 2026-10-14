import { test, expect } from "@playwright/test";
test("select arrows have a reserved lane in both themes and narrow layouts", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const theme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: theme });
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/candidates?role=Front-End%20Developer");
      for (const picker of await page.locator("select").all()) {
        await expect(picker).toHaveCSS("appearance", "none");
        const metrics = await picker.evaluate((el) => {
          const style = getComputedStyle(el);
          const arrow = el
            .parentElement!.querySelector("svg")!
            .getBoundingClientRect();
          const rect = el.getBoundingClientRect();
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;
          ctx.font = style.font;
          return {
            inset: rect.right - arrow.right,
            reserve: parseFloat(style.paddingRight),
            textWidth: ctx.measureText(el.selectedOptions[0].text).width,
            available:
              rect.width -
              parseFloat(style.paddingLeft) -
              parseFloat(style.paddingRight) -
              2,
          };
        });
        expect(metrics.inset).toBeGreaterThanOrEqual(13);
        expect(metrics.reserve).toBeGreaterThanOrEqual(40);
        expect(metrics.textWidth).toBeLessThanOrEqual(metrics.available);
      }
      await page
        .locator(".filters")
        .screenshot({
          path: `artifacts/appearance/selects-${theme}-${width}.png`,
        });
      await page.goto("/intake");
      await page
        .getByRole("combobox", { name: "Role", exact: true })
        .selectOption("Node.js Developer");
      await expect(
        page.getByRole("combobox", { name: "Role", exact: true }),
      ).toHaveValue("Node.js Developer");
      await page.goto("/candidates");
      await page.getByRole("button", { name: "View Avery Morgan" }).click();
      await page.getByRole("button", { name: "Edit details" }).click();
      await expect(page.getByRole("dialog").locator("select")).toHaveCSS(
        "appearance",
        "none",
      );
      await page
        .getByRole("dialog")
        .locator("select")
        .selectOption("FULL Stack Developer");
      await page.getByRole("button", { name: "Save changes" }).click();
      await expect(
        page
          .getByRole("dialog")
          .getByText("FULL Stack Developer", { exact: true }),
      ).toBeVisible();
    }
  }
});
