import { buildDeclarations } from "./build-types.ts";
await buildDeclarations("react", process.argv.includes("--check"));
