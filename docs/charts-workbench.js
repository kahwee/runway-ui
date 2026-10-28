const $ = (s) => document.querySelector(s);
const initial = $("#gallery").innerHTML;
function update() {
  document.body.dataset.theme = $("#chart-theme").value;
  $("#gallery").innerHTML = initial;
  const dataset = $("#chart-data").value;
  document.querySelectorAll(".rw-figure").forEach((figure) => {
    figure.style.setProperty("--rw-chart-height", `${$("#chart-height").value}px`);
    figure.dataset.grid = $("#chart-grid").checked ? "on" : "off";
  });
  if (dataset !== "normal") {
    document.querySelectorAll(".chart-card").forEach((card) => {
      const kind = card.dataset.chart;
      card.querySelectorAll("[data-value]").forEach((mark) => {
        const value =
          dataset === "zero"
            ? 0
            : kind === "stacked"
              ? 50
              : mark.hasAttribute("data-negative")
                ? -100
                : 100;
        mark.dataset.value = String(value);
        mark.style.setProperty("--rw-amount", value);
      });
      if (kind === "columns")
        card.querySelectorAll(".rw-columns strong").forEach((e) => {
          e.textContent = dataset === "zero" ? "0" : "100";
        });
      if (kind === "stacked")
        card.querySelectorAll(".rw-series-list strong").forEach((e) => {
          e.textContent = dataset === "zero" ? "0" : "100";
        });
      if (kind === "diverging")
        card.querySelectorAll(".rw-series-list strong").forEach((e, i) => {
          e.textContent = dataset === "zero" ? "0" : [100, -100, -100, 100][i];
        });
      card.querySelectorAll("tbody tr").forEach((row, i) => {
        row.querySelectorAll("td").forEach((cell) => {
          cell.textContent =
            dataset === "zero"
              ? "0"
              : kind === "stacked"
                ? "50"
                : kind === "diverging"
                  ? String([100, -100, -100, 100][i])
                  : "100";
        });
      });
      if (kind === "area")
        for (let i = 0; i < 6; i++)
          card
            .querySelector(".rw-area")
            .style.setProperty(`--rw-y${i}`, dataset === "zero" ? "100%" : "0%");
    });
  }
  $("#chart-recipe").textContent = `<link rel="stylesheet" href="runway-ui/dist/runway-ui.css">
<section class="rw-ui">
${document.querySelector('[data-chart="columns"] figure').outerHTML}
</section>`;
}
$("#chart-options").addEventListener("change", update);
$("#chart-options").addEventListener("submit", (e) => e.preventDefault());
$("#chart-options").addEventListener("reset", () => requestAnimationFrame(update));
$("#copy-chart").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("#chart-recipe").textContent);
    $("#copy-status").textContent = "Markup copied.";
  } catch {
    $("#copy-status").textContent = "Select and copy the markup below.";
  }
});
const attr = CSS.supports("width", "calc(attr(data-value type(<number>),0) * 1px)");
const shape = CSS.supports("clip-path", "shape(from 0% 100%,line to 100% 0%,close)");
$("#chart-support").textContent =
  `This browser: typed attr() ${attr ? "active" : "fallback"} · shape() ${shape ? "active" : "polygon fallback"} · CSS computes every plot. Fixed scales keep dataset comparisons honest.`;
update();
