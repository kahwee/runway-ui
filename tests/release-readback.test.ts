import assert from "node:assert/strict";
import test from "node:test";

const workflow = Bun.YAML.parse(
  await Bun.file(new URL("../.github/workflows/publish.yml", import.meta.url)).text(),
) as any;
const steps = workflow.jobs.publish.steps;
const step = steps.find(
  (value: any) => value.name === "Verify registry propagation after successful publication",
);
const source = step.run.match(
  /\/\/ BEGIN registry verifier[^\n]*\n([\s\S]*?)\/\/ END registry verifier/,
)[1];
// Exercise the exact self-contained Node function embedded in the workflow.
const verifyRegistry = new Function(`return (${source.trim()})`)();
const version = "1.1.0",
  tag = "latest",
  integrity = "sha512-tested-archive";
const published = { version, dist: { integrity } };
const index = { versions: { [version]: published }, "dist-tags": { [tag]: version } };

function harness(replies: any[]) {
  let clock = 0;
  const calls: string[] = [],
    logs: string[] = [];
  return {
    calls,
    logs,
    options: {
      version,
      tag,
      integrity,
      timeoutMs: 50,
      intervalMs: 10,
      now: () => clock,
      sleep: async (ms: number) => {
        clock += ms;
      },
      log: (message: string) => logs.push(message),
      fetcher: async (url: string, options: any) => {
        calls.push(url);
        assert.equal(options.cache, "no-store");
        assert.ok(options.signal instanceof AbortSignal);
        const reply = replies.shift() ?? { status: 404 };
        if (reply instanceof Error) throw reply;
        return {
          status: reply.status,
          json: async () => {
            if (reply.invalid) throw Error("Invalid JSON");
            return reply.body;
          },
        };
      },
    },
  };
}

test("registry readback retries eventual 404s without another upload", async () => {
  const fixture = harness([
    { status: 404 },
    { status: 200, body: published },
    { status: 404 },
    { status: 200, body: published },
    { status: 200, body: index },
  ]);
  await verifyRegistry(fixture.options);
  assert.equal(fixture.calls.length, 5);
  assert.match(fixture.logs.at(-1)!, /Verified/);
  const commands = steps.map((value: any) => value.run ?? "").join("\n");
  assert.equal(commands.match(/^npm publish /gm)?.length, 1);
  assert.doesNotMatch(step.run, /npm publish|npm view/);
});

test("a stale package index can catch up after the version endpoint", async () => {
  const stale = { versions: {}, "dist-tags": { latest: "1.0.0" } };
  const fixture = harness([
    { status: 200, body: published },
    { status: 200, body: stale },
    { status: 200, body: published },
    { status: 200, body: index },
  ]);
  await verifyRegistry(fixture.options);
  assert.equal(fixture.calls.length, 4);
});

test("terminal propagation timeout reports successful upload without republishing", async () => {
  const fixture = harness([]);
  await assert.rejects(
    verifyRegistry(fixture.options),
    /timed out.*Publication already succeeded.*Do not republish/,
  );
  assert.ok(fixture.calls.length <= 5);
});

test("published version, integrity and confirmed dist-tag mismatches fail immediately", async () => {
  for (const bad of [
    { ...published, version: "1.0.0" },
    { ...published, dist: { integrity: "sha512-other" } },
  ]) {
    const fixture = harness([{ status: 200, body: bad }]);
    await assert.rejects(verifyRegistry(fixture.options), /mismatch.*Do not republish/);
    assert.equal(fixture.calls.length, 1);
  }
  const fixture = harness([
    { status: 200, body: published },
    { status: 200, body: { ...index, "dist-tags": { latest: "1.0.0" } } },
  ]);
  await assert.rejects(verifyRegistry(fixture.options), /dist-tag mismatch.*Do not republish/);
  assert.equal(fixture.calls.length, 2);
});

test("auth, permanent HTTP, network and malformed responses are not propagation retries", async () => {
  for (const reply of [
    { status: 401 },
    { status: 403 },
    { status: 500 },
    new Error("network"),
    { status: 200, invalid: true },
  ]) {
    const fixture = harness([reply]);
    await assert.rejects(verifyRegistry(fixture.options), /Do not republish/);
    assert.equal(fixture.calls.length, 1);
  }
});

test("an already propagated publication verifies immediately without a cooldown", async () => {
  const fixture = harness([
    { status: 200, body: published },
    { status: 200, body: index },
  ]);
  fixture.options.sleep = async () => assert.fail("No delay is needed when registry data is ready");
  await verifyRegistry(fixture.options);
  assert.equal(fixture.calls.length, 2);
});
