import { test, expect } from "@playwright/test";
test.use({
  video: { mode: "on", size: { width: 1440, height: 1000 } },
  viewport: { width: 1440, height: 1000 },
});
test("journey moves, settles, replays and respects reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({
    reducedMotion: "no-preference",
    colorScheme: "dark",
  });
  await page.goto("/");
  const packet = page.locator(".flow-packet");
  await expect(page.getByRole("button", { name: "Stop motion" })).toBeVisible();
  await page.waitForTimeout(1100);
  const first = await packet.evaluate((el) => getComputedStyle(el).transform);
  await page.screenshot({
    path: "artifacts/appearance/motion-review-frame.png",
    fullPage: false,
  });
  await page.waitForTimeout(1800);
  const next = await packet.evaluate((el) => getComputedStyle(el).transform);
  expect(next).not.toBe(first);
  await expect(
    page.getByRole("button", { name: "Replay journey" }),
  ).toBeVisible({ timeout: 6000 });
  expect(
    await page
      .locator(".flow-scene")
      .evaluate(
        (el) =>
          el
            .getAnimations({ subtree: true })
            .filter((a) => a.playState === "running").length,
      ),
  ).toBe(0);
  await page.getByRole("button", { name: "Replay journey" }).click();
  await expect(page.locator(".flow-scene")).toHaveClass(/is-playing/);
  await page.waitForTimeout(4200); // Capture the full replay for the motion review video.
  await page.getByRole("button", { name: "Stop motion" }).click();
  expect(
    await page
      .locator(".flow-scene")
      .evaluate((el) => el.getAnimations({ subtree: true }).length),
  ).toBe(0);
  await page.getByRole("button", { name: "Replay journey" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("button", { name: "Motion off" })).toBeDisabled();
  await expect(
    page.getByText("Reduced motion · static illustration"),
  ).toBeVisible();
  expect(
    await page
      .locator("main")
      .evaluate((el) => el.getAnimations({ subtree: true }).length),
  ).toBe(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "artifacts/appearance/motion-static-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
