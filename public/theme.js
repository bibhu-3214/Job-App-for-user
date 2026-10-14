// Runs before CSS and React so the initial canvas uses the saved/system theme.
(() => {
  let preference = "system";
  try {
    const saved = localStorage.getItem("forma.appearance.v1");
    if (["light", "dark", "system"].includes(saved)) preference = saved;
  } catch {
    /* Storage can be unavailable; system mode remains usable. */
  }
  const dark =
    preference === "dark" ||
    (preference === "system" &&
      matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.documentElement.dataset.appearance = preference;
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
  document.documentElement.style.backgroundColor = dark ? "#10121c" : "#f7f8fa";
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", dark ? "#10121c" : "#f7f8fa");
})();
