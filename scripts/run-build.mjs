const root = Bun.fileURLToPath(new URL("../", import.meta.url));
// These generators own disjoint outputs. Wait for every child before reporting failure.
const tasks = ["build-types.mjs", "build-react-types.mjs", "build.mjs"];
const results = await Promise.allSettled(
  tasks.map(async (task) => {
    const child = Bun.spawn([process.execPath, `scripts/${task}`], {
      cwd: root,
      stdout: "inherit",
      stderr: "inherit",
    });
    const code = await child.exited;
    if (code !== 0) throw new Error(`${task} failed with exit code ${code}`);
  }),
);
for (const result of results) {
  if (result.status === "rejected") {
    console.error(result.reason);
    process.exitCode = 1;
  }
}
