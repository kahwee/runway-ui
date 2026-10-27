/** Run against the built CSS in a real browser, including --force-high-contrast. */
export async function runFieldContracts() {
  for (const fixture of document.querySelectorAll("[data-field-contract]")) fixture.remove();
  const root = document.createElement("section");
  root.dataset.fieldContract = "";
  root.style.cssText = "display:grid;grid-template-columns:repeat(3,220px);gap:32px";
  const long = "AReallyLongUnbrokenWorkspaceIdentifierWithoutAnyNaturalWordBreaks0123456789";
  const cases = [
    ["plain", "ltr", false],
    ["rich", "ltr", true],
    ["plain-rtl", "rtl", false],
    ["rich-rtl", "rtl", true],
  ];
  root.innerHTML = cases
    .map(
      ([id, direction, rich]) => `<div class="rw-field" dir="${direction}">
        <label for="${id}">${id}</label>
        <select class="rw-input" id="${id}">
          ${rich ? "<button><selectedcontent></selectedcontent></button>" : ""}
          <option value="long">${rich ? `<span class="rw-option__icon" aria-hidden="true">A</span><span><strong>${long}</strong><small>Option description</small></span>` : long}</option>
          <option value="short">Short alternative</option>
          <option value="unavailable" disabled>Unavailable</option>
          <option value="last">Last choice</option>
        </select>
      </div>`,
    )
    .join("");
  root.innerHTML += `<div class="rw-field"><label for="native">Native opt-out</label><select class="rw-input" id="native" data-picker="native"><option>${long}</option></select></div>
    <div class="rw-field"><label for="disabled">Disabled</label><select class="rw-input" id="disabled" disabled><option>Unavailable</option></select></div>
    <button class="rw-button" id="neighbor" type="button">Adjacent action</button>
    <div class="rw-field"><label for="list">Multiple select</label><select class="rw-input" id="list" multiple><option>One</option><option>Two</option></select></div>`;
  document.body.append(root);
  await new Promise(requestAnimationFrame);
  let checks = 0;
  const assert = (condition, message) => {
    if (!condition) throw Error(message);
    checks++;
  };
  const forcedColors = matchMedia("(forced-colors: active)").matches;
  for (const [id] of cases) {
    const select = root.querySelector(`#${id}`);
    const rect = select.getBoundingClientRect();
    assert(rect.width <= 221, `${id}: select fits its 220px container`);
    assert(select.scrollWidth <= select.clientWidth + 1, `${id}: selected text stays inside`);
    const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    assert(hit === select || select.contains(hit), `${id}: adjacent field does not cover click`);
    select.focus();
    assert(document.activeElement === select, `${id}: native select can receive focus`);
    if (forcedColors) {
      assert(
        getComputedStyle(select).appearance === "auto",
        `${id}: forced colors use native appearance`,
      );
      assert(
        getComputedStyle(select, "::picker(select)").appearance === "auto",
        `${id}: forced colors reset picker appearance too`,
      );
      assert(getComputedStyle(select).outlineStyle !== "none", `${id}: focus remains visible`);
    }
    assert(select.options[2].disabled, `${id}: unavailable choice remains disabled`);
  }
  const native = root.querySelector("#native");
  assert(
    getComputedStyle(native).appearance === (forcedColors ? "auto" : "none"),
    "Native opt-out preserves its expected skin",
  );
  assert(
    getComputedStyle(root.querySelector("#list")).appearance === "auto",
    "Multiple select stays native",
  );
  const disabled = root.querySelector("#disabled");
  disabled.focus();
  assert(document.activeElement !== disabled, "Disabled select cannot take focus");
  const neighbor = root.querySelector("#neighbor");
  const rect = neighbor.getBoundingClientRect();
  assert(
    document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2) === neighbor,
    "Adjacent action remains reachable",
  );
  const labels = document.createElement("section");
  labels.style.cssText = root.style.cssText;
  labels.style.marginBlockStart = "32px";
  labels.dataset.fieldContract = "";
  const labelCases = [
    [
      "required-label",
      `<input class="rw-input" id="required-label" value="Current value" required>`,
    ],
    ["native-label", `<input id="native-label" value="Native value">`],
    ["textarea-label", `<textarea class="rw-input" id="textarea-label">Notes</textarea>`],
    ["disabled-label", `<input class="rw-input" id="disabled-label" value="Locked" disabled>`],
    ["ordinary-label", `<input class="rw-input" id="ordinary-label" value="Ordinary">`],
    [
      "group-label",
      `<div class="rw-input-group"><input class="rw-input" id="group-label" value="Query"><button class="rw-button" type="button">Search</button></div>`,
    ],
  ];
  labels.innerHTML = labelCases
    .map(
      ([id, control]) =>
        `<div class="rw-field rw-native"><label for="${id}"><span>${id === "ordinary-label" ? "Ordinary label" : long}</span></label>${control}<small>${id === "ordinary-label" ? "Short hint" : long}</small></div>`,
    )
    .join("");
  root.after(labels);
  for (const [id] of labelCases) {
    const input = labels.querySelector(`#${id}`);
    const field = input.closest(".rw-field");
    field.scrollIntoView({ block: "center", behavior: "instant" });
    const label = field.querySelector("label");
    assert(label.scrollWidth <= label.clientWidth + 1, `${id}: label stays inside field`);
    assert(
      input.getBoundingClientRect().width <= field.clientWidth + 1,
      `${id}: label does not enlarge control`,
    );
    assert(field.scrollWidth <= field.clientWidth + 1, `${id}: hint stays inside field`);
    const bounds = input.getBoundingClientRect();
    assert(
      document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2) ===
        input,
      `${id}: adjacent label does not cover input`,
    );
    if (input.disabled) {
      input.focus();
      assert(document.activeElement !== input, `${id}: disabled semantics retained`);
    } else {
      input.focus();
      assert(document.activeElement === input, `${id}: native control retains focus`);
    }
  }
  native.focus();
  return { checks, forcedColors, browser: navigator.userAgent };
}
