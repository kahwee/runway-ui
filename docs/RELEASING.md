# Release checklist

Runway UI is a JavaScript/TypeScript library; it does not need a Rust crate.
A main-branch push, a Pages deployment and an npm package publication are
separate outcomes. Publishing a package or creating a tag/release requires an
explicit request; the current workflows do not publish to npm.

## Prepare and validate

Use the Bun version in `.bun-version` and the committed `bun.lock`:

```sh
bun install --frozen-lockfile
bun check
bun run test-behaviors
bun run build
bun run build-site
bun run check-docs
bun pm pack --dry-run
```

`bun check` is the project script: source/boundary/format checks, generated
public declarations, native type checks and the dependency-map check. Bun does
not have a built-in general-purpose lint command. `test-behaviors` runs the
TypeScript test suite, including boundary, dialog and package-export contracts.
`build-site` builds the library, Storybook and static documentation; it does not
deploy. Do not run the library and Storybook builds concurrently in one checkout:
Storybook consumes generated library assets.

For a requested versioned release, choose the version using the
[compatibility policy](STABILITY.md), update `package.json` and the lockfile
consistently, and record changes and migration instructions in
[CHANGELOG.md](CHANGELOG.md). Preserve public exports, the zero-runtime-dependency
vanilla entry and the isolated optional React peers. Review relevant browser,
keyboard, forced-color and reduced-motion behavior; passing tooling alone does
not establish browser support.

Commit source changes together with generated `styles/icons.css` and
`dist/runway-ui.css`, then run:

```sh
bun run check-generated
```

This compares rebuilt CSS against `HEAD`, so intended generated changes must be
committed first. Authored modules are TypeScript/TSX. Generated JavaScript and
public declarations under `dist/behaviors` and `dist/react` are rebuilt, not
hand-edited; type and package-export tests check those outputs.

## Main and Pages

Push only the reviewed, tested changes and verify the exact commit's Package
and GitHub Pages workflows. Before publication, run `bun run build-site`,
`bun run check-docs` and `bun run check-pages`. The browser gate serves the build
under the real project prefix and checks the public entry points and recipes.
After deployment, run `bun run check-pages https://kahwee.github.io/runway-ui/`
to verify the live artifact. See [Storybook checks](STORYBOOK.md).
A successful Pages deployment updates the workshop,
docs and Storybook, not the npm registry. Verify the relevant live behavior and
report the commit and workflow links without claiming package publication.

## Package readiness and publication

Inspect `bun pm pack --dry-run` output for the public exports, generated runtime
JavaScript, declarations, CSS and MIT license. The `prepack` hook rebuilds the
library. Source archive consumers must install and run `bun run build` before
using runtime exports: authored TypeScript is not a prebuilt JavaScript archive.

Only after explicit publication authorization, verify the requested version is
not already published, use the approved registry/trust workflow, and verify the
published archive and consumer imports. Do not add credentials, alter workflow
permissions or publish tags as an incidental cleanup step.
