import { rm } from "node:fs/promises";

// Only disposable build directories; committed CSS is retained.
const directories = ["storybook-static", ".site", ".types", "dist/behaviors", "dist/react"];
await Promise.all(
  directories.map((directory) =>
    rm(new URL(`../${directory}/`, import.meta.url), { recursive: true, force: true }),
  ),
);
console.log(`Removed disposable build output: ${directories.join(", ")}`);
