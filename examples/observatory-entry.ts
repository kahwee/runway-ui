import { bindObservatory } from "./observatory/controller.ts";
import { renderObservatory } from "./observatory/render.ts";

const { root, data } = renderObservatory();
document.querySelector("#observatory").append(root);
const controller = bindObservatory(root, data);
addEventListener("pagehide", () => controller.destroy(), { once: true });
