import { runFieldContracts } from "./fields-browser.ts";

const result = document.querySelector<HTMLElement>("#result");
try {
  const receipt = await runFieldContracts();
  result.textContent = `${receipt.checks} checks passed · forced colors: ${receipt.forcedColors}`;
  result.dataset.result = "passed";
} catch (error) {
  result.textContent = String(error);
  result.dataset.result = "failed";
  throw error;
}
