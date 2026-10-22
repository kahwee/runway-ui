const views = {
  cottage: [
    "YOUR LITTLE CORNER",
    "Make yourself at home.",
    "A cozy place to check in, make a small plan, and see what the day has brought.",
    "Everything in its own time",
  ],
  garden: [
    "SOMETHING IS GROWING",
    "A little patience goes a long way.",
    "Tend a small patch, notice a new leaf, and leave a little room for the unexpected.",
    "Three seedlings looking hopeful",
  ],
  letters: [
    "A NOTE FROM SOMEWHERE",
    "Good things in the post.",
    "A place for thoughtful messages, small invitations, and news worth keeping.",
    "One lovely letter waiting",
  ],
  pantry: [
    "SAVE A LITTLE FOR LATER",
    "Small treasures, neatly kept.",
    "Keep the useful things close, the special things safe, and a spare jar for whatever comes next.",
    "A comfortable supply of possibilities",
  ],
  cloud: [
    "LOOK UP FOR A MOMENT",
    "Cloudy, with a chance of lovely.",
    "Make room for changing conditions. Some plans need sunshine; others are better with a little rain.",
    "A soft afternoon ahead",
  ],
  picnic: [
    "TAKE THE AFTERNOON OFF",
    "There is always room on the blanket.",
    "Pack something simple, pick a nice spot, and invite a little company.",
    "The basket is ready",
  ],
};
function render() {
  const key = Object.hasOwn(views, location.hash.slice(1)) ? location.hash.slice(1) : "cottage";
  const [category, title, description, status] = views[key];
  for (const link of document.querySelectorAll("[data-view]")) {
    if (link.dataset.view === key) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
  document.querySelector("#view-category").textContent = category;
  document.querySelector("#view-title").textContent = title;
  document.querySelector("#view-description").textContent = description;
  document.querySelector("#view-status").textContent = status;
  document.querySelector("#view-art").src = `assets/view-tabs/${key}.svg`;
}
window.addEventListener("hashchange", render);
render();
