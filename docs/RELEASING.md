# Release checklist

Runway UI is a JavaScript/TypeScript library; it does not need a Rust crate.
A main-branch push, a Pages deployment and an npm package publication are
separate outcomes. Publishing a package or creating a tag/release requires an
explicit request. The tag-only npm workflow below is separate from main/Pages deployment.

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
[CHANGELOG.md](CHANGELOG.md). Preserve public exports, the zero-runtime-dependency CSS and the required React, Base UI and TanStack Charts peers. Review relevant browser,
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

## Automatic npm publication

The package is `@kahwee/runway-ui` from `kahwee/runway-ui`. The workflow file is
`.github/workflows/publish.yml`, with no GitHub environment. Its publishing job
alone requests OIDC `id-token: write`; npm's trusted-publisher binding must match
owner `kahwee`, repository `runway-ui`, and filename `publish.yml` exactly.
An account owner configures that binding separately. No npm token, local login,
2FA change or package-manager credential is required by the workflow.

Ordinary main pushes and pull requests validate but never publish. A `vX.Y.Z`
tag must match `package.json` exactly and point to source reachable from main.
Stable versions publish to `latest`; prereleases such as `v0.6.0-beta.2` publish
to `next`. The workflow explicitly selects the tag rather than relying on
`publishConfig.tag`. It does not create tags, bump versions, promote older
versions or retry publication. An existing registry version stops the job.

Before requesting a version tag, update the version and lockfile consistently,
record migration notes in the changelog, and merge the tested source to main.
Tag publication remains a deliberate release action, not incidental cleanup.
The validation job runs the checks above plus the real Pages browser gate,
creates one archive and installs it into an isolated consumer with the tested
React/Base UI/TanStack peers. It checks runtime imports, declarations, CSS and a
server-rendered React component. Only that archive passes to the publishing job;
its checksum is verified before publishing. Registry version, archive integrity
and the intended dist-tag are checked afterward.

The package already exists; no bootstrap publication is needed. At setup,
`next` points to `0.6.0-beta.1` and `latest` to `0.6.0-beta.0`. Enabling this
workflow does not change either tag or make the current beta a stable release.

The `prepack` hook rebuilds for manual packing. This workflow explicitly builds
and validates before packing without lifecycle scripts; publication also skips
scripts so the tested bytes stay unchanged. Generated runtime JavaScript and
public declarations must be present in the archive. Source archive consumers
must install and run `bun run build` before using runtime exports.
