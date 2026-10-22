document.querySelectorAll(".rw-segmented").forEach((group) => {
  group.addEventListener("click", (event) => {
    const selected = event.target.closest(".rw-segment");
    if (!selected || selected.disabled) return;
    for (const button of group.querySelectorAll(".rw-segment")) {
      button.setAttribute("aria-pressed", String(button === selected));
    }
  });
});
