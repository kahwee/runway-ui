import { runBehaviorContracts } from "./browser-contracts.ts";

const result = document.querySelector<HTMLElement>("#result");
try {
  const receipt = await runBehaviorContracts();
  result.textContent = `${receipt.modules} modules passed · ${receipt.browser}`;
  result.dataset.result = "passed";
} catch (error) {
  result.textContent = String(error);
  result.dataset.result = "failed";
  throw error;
}
