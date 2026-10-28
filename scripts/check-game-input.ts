// Build runtime and Storybook, serve the checkout root, then pass /storybook-static/ as origin.
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { mkdir } from "node:fs/promises";
const origin = new URL(process.argv[2] ?? "http://127.0.0.1:6031/storybook-static/");
const evidence = resolve(process.argv[3] ?? ".local/game-input");
const session = `runway-input-${process.pid}`;
await mkdir(evidence, { recursive: true });
async function browser(...args: string[]) {
  const child = Bun.spawn(["agent-browser", "--session", session, "--json", ...args], {
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  assert.equal(code, 0, JSON.stringify({ args, stdout, stderr }));
  const result = JSON.parse(stdout);
  assert.equal(result.success, true, JSON.stringify(result));
  return result.data;
}
const evaluate = async (source: string) => (await browser("eval", source)).result;
const click = async (name: string) => {
  await browser("snapshot", "-i");
  await browser("find", "role", "button", "click", "--name", name, "--exact");
};
const status = () => evaluate("document.querySelector('[role=status]').textContent");
const story = (id: string, args = "") => {
  const url = new URL("iframe.html", origin);
  url.searchParams.set("id", id);
  url.searchParams.set("viewMode", "story");
  if (args) url.searchParams.set("args", args);
  return url.href;
};
try {
  for (const [width, height] of [
    [320, 740],
    [390, 844],
    [768, 1024],
    [1366, 768],
    [1440, 900],
  ]) {
    await browser("set", "viewport", String(width), String(height));
    await browser("open", story("react-game-input--command-station"));
    await browser("tab", "t1");
    await browser("wait", ".react-input-grid");
    await click("Build");
    await browser("press", "Tab");
    assert.equal(
      await evaluate("document.activeElement.textContent"),
      "Research",
      "Tab stays native and skips disabled controls",
    );
    await browser("press", "Home");
    await browser("press", "ArrowRight");
    assert.equal(await evaluate("document.activeElement.textContent"), "Research");
    await browser("press", "Enter");
    assert.equal(await status(), "Research selected", "Native button Enter activation");
    await browser("press", "Home");
    await browser("press", "ArrowDown");
    assert.equal(await evaluate("document.activeElement.textContent"), "Trade");
    await browser("press", "n");
    assert.equal(await status(), "Cycle advanced");
    await click("Build");
    await click("Remap next-cycle key");
    await browser("press", "n");
    assert.equal(await status(), "Build selected");
    await browser("press", "x");
    assert.equal(await status(), "Cycle advanced");
    assert.equal(await evaluate("document.querySelector('.rw-input-hints kbd').textContent"), "x");
    await browser("find", "label", "Notes", "click");
    await browser("press", "x");
    assert.equal(await evaluate("document.querySelector('input').value"), "x");
    await click("Nested command");
    await browser("press", "n");
    assert.equal(await status(), "Nested action");
    await browser("press", "x");
    assert.equal(await status(), "Nested action");
    await click("Outside command scope");
    await browser("press", "x");
    assert.equal(await status(), "Outside selected");
    await click("Open decision");
    await browser("wait", "dialog[open]");
    await browser("press", "x");
    assert.equal(await status(), "Outside selected");
    await browser("press", "Escape");
    await browser("tab", "t1");
    await browser(
      "wait",
      "--fn",
      "document.querySelector('[role=status]').textContent === 'Decision: dismissed'",
    );
    await click("Open decision");
    await browser("find", "label", "Require an explicit decision", "check");
    await browser("press", "Escape");
    assert.equal(await evaluate("document.querySelector('dialog').open"), true);
    await click("Confirm decision");
    await browser("wait", "--fn", "!document.querySelector('dialog').open");
    await browser("tab", "t1");
    await browser(
      "wait",
      "--fn",
      "document.querySelector('[role=status]').textContent === 'Decision: confirm'",
    );
    assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth"));
    assert.deepEqual((await browser("errors")).errors, []);
    await browser("screenshot", resolve(evidence, `${width}-input.png`), "--full");
    await browser("open", story("react-desk--playable"));
    await browser("tab", "t1");
    await browser("wait", ".rw-control-console");
    const consoleState = await evaluate(
      "({text:document.querySelector('.rw-control-console > span').textContent,visible:document.querySelector('.rw-control-console > span').getBoundingClientRect().height>0,overflow:document.documentElement.scrollWidth>innerWidth})",
    );
    assert.ok(
      consoleState.visible && consoleState.text && !consoleState.overflow,
      JSON.stringify(consoleState),
    );
    await browser("screenshot", resolve(evidence, `${width}-console.png`), "--full");
    console.log(
      `${width}px: shortcuts, remapping, native editing, nested/outside boundaries, modal guards and visible console content passed.`,
    );
  }
  await browser("open", story("react-game-input--controller"));
  await browser("tab", "t1");
  await browser("wait", ".react-input-grid");
  await evaluate(
    `window.__testPad={connected:true,mapping:'standard',axes:[0,0],buttons:Array.from({length:16},()=>({pressed:false,value:0,touched:false}))};Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>[window.__testPad]});`,
  );
  await click("Build");
  await browser("wait", "100");
  await evaluate("window.__testPad.buttons[15].pressed=true");
  await browser("wait", "--fn", "document.activeElement.textContent === 'Research'");
  await evaluate("window.__testPad.buttons[15].pressed=false");
  await browser("wait", "50");
  await evaluate("window.__testPad.buttons[0].pressed=true");
  await browser(
    "wait",
    "--fn",
    "document.querySelector('[role=status]').textContent === 'Research selected'",
  );
  await evaluate("window.__testPad.buttons[0].pressed=false");
  await browser("wait", "50");
  await evaluate("window.__testPad.buttons[1].pressed=true");
  await browser(
    "wait",
    "--fn",
    "document.querySelector('[role=status]').textContent === 'Back requested'",
  );
  await evaluate("window.__testPad.buttons[1].pressed=false");
  await browser("wait", "50");
  await click("Nested command");
  await evaluate("window.__testPad.buttons[0].pressed=true");
  await browser("wait", "100");
  assert.equal(await status(), "Nested selected");
  await evaluate(
    "window.__polls=0;const read=navigator.getGamepads;Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>{window.__polls++;return read();}})",
  );
  await click("Build");
  await browser("wait", "100");
  const beforeBlur = await evaluate("window.__polls");
  assert.ok(beforeBlur > 0, "Controller must have polled before stop tests");
  const atBlur = await evaluate(
    "Object.defineProperty(document,'hasFocus',{configurable:true,value:()=>false});window.dispatchEvent(new Event('blur'));window.__polls",
  );
  await browser("wait", "100");
  assert.equal(await evaluate("window.__polls"), atBlur, "Window blur must stop polling");
  await evaluate("delete document.hasFocus;window.dispatchEvent(new Event('focus'))");
  await browser("wait", "100");
  assert.ok((await evaluate("window.__polls")) > atBlur, "Window focus must resume polling");
  await click("Disable controller");
  await browser("wait", "50");
  const stopped = await evaluate("window.__polls");
  await browser("wait", "100");
  assert.equal(await evaluate("window.__polls"), stopped, "Disabled controller must stop polling");
  console.log(
    "Simulated standard gamepad: navigation, activation, back and nested-scope isolation passed. No physical hardware claim.",
  );
  // Exercise actual generated fallback policy on a native modal, with newer capabilities removed locally.
  const runtime = new URL("/dist/react/dialog-policy.js", origin);
  await evaluate(`(async()=>{
    const {attachDialogPolicy}=await import(${JSON.stringify(runtime.href)});
    const descriptor=Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype,'closedBy');
    if(descriptor) delete HTMLDialogElement.prototype.closedBy;
    const dialog=document.createElement('dialog');dialog.innerHTML='<button>Fallback decision</button>';dialog.style.cssText='width:200px;height:100px';document.body.append(dialog);
    Object.defineProperty(dialog,'requestClose',{value:undefined});
    window.__fallback={dialog,allowed:false,closed:0};
    const destroy=attachDialogPolicy(dialog,()=>({canDismiss:()=>window.__fallback.allowed,onClose:()=>window.__fallback.closed++}));
    if(descriptor)Object.defineProperty(HTMLDialogElement.prototype,'closedBy',descriptor);
    window.__fallback.destroy=destroy;dialog.returnValue='preserved';dialog.showModal();
  })()`);
  const outside = async () => {
    await browser("mouse", "move", "2", "2");
    await browser("mouse", "down");
    await browser("mouse", "up");
  };
  await outside();
  assert.equal(await evaluate("window.__fallback.dialog.open"), true);
  await evaluate(
    "window.__fallback.allowed=true;window.__fallback.dialog.addEventListener('cancel',e=>e.preventDefault(),{once:true})",
  );
  await outside();
  assert.equal(await evaluate("window.__fallback.dialog.open"), true);
  await outside();
  await browser("wait", "--fn", "!window.__fallback.dialog.open");
  assert.deepEqual(
    await evaluate(
      "({closed:window.__fallback.closed,value:window.__fallback.dialog.returnValue})",
    ),
    { closed: 1, value: "preserved" },
  );
  await evaluate(
    "window.__fallback.destroy();window.__fallback.dialog.remove();delete window.__fallback;delete window.__testPad",
  );
  assert.deepEqual((await browser("errors")).errors, []);
  console.log(
    "Native modal with simulated missing dismissal APIs: guard, external cancel veto, return value and close notification passed.",
  );
} finally {
  await browser("close");
}
