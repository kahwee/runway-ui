# TypeScript sources and browser output

All authored behaviors, React components, Storybook stories, documentation scripts,
examples, tests and build tools use TypeScript or TSX. Bun runs the tooling and
unit tests directly. `bun run lint` rejects JavaScript source files and inline
HTML scripts outside generated output.

The three remaining vanilla compatibility modules and the React entry are strictly checked. Their
public types are declared in source and emitted to `dist/behaviors` and
`dist/react`. The docs, tooling and test doubles are also type-checked, with
inferred parameters allowed. React stories have an additional strict check.
No `@ts-nocheck` migration escape hatch is used.

## Build and consume

Run `bun install --frozen-lockfile` and `bun run build` after cloning or downloading
a source archive. JavaScript and declarations are generated, not maintained as
second copies. Package entry names such as `@kahwee/runway-ui/dialog` and `@kahwee/runway-ui/react`
are unchanged; they now resolve to compiled files under `dist/`. The package
prepack hook creates those files. Source archive consumers must build first;
direct source paths now end in `.ts`.

Browsers require JavaScript. `bun run build-site` compiles the workshop, docs,
examples and behaviors to JavaScript and rewrites module URLs in the generated
site. The hosted `behaviors/*.js` URLs remain available. Serve `.site`, rather
than the uncompiled checkout, with a static web server. Storybook's Vite pipeline
compiles its TypeScript and TSX directly.

## Validation

- `bun run check`: source policy, import boundaries, formatting, all type checks
  and dependency documentation.
- `bun run test-behaviors`: native behavior fixtures, React rendering, package
  exports and TypeScript-to-browser import contracts.
- `bun run build-site` and `bun run check-docs`: Storybook, examples and local links.
- `bun run check-generated`: committed CSS parity. Executable modules and their
  declarations are generated under ignored `dist/behaviors` and `dist/react`.

Consumer type fixtures retain negative assertions for unsupported controls and
incorrect callbacks. Required React peers do not enter the standalone CSS or vanilla runtime. Component props live with their named owners; the public facade re-exports them unchanged.
