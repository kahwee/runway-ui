import { rm } from "node:fs/promises";

// Only disposable build directories; committed CSS and declarations are package assets.
const directories = ["storybook-static", ".site", ".types"];
await Promise.all(
  directories.map((directory) =>
    rm(new URL(`../${directory}/`, import.meta.url), { recursive: true, force: true }),
  ),
);
console.log(`Removed disposable build output: ${directories.join(", ")}`);
