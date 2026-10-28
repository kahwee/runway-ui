# Compatibility contract

Runway UI follows semantic versioning from 1.0.0. See [the changelog](CHANGELOG.md) for migrations.

- Patch releases fix bugs and keep existing `rw-` classes, package entry points, React component props and documented numeric units.
- Minor releases add components, props and themes without breaking existing ones.
- Major releases may break the above, with migration notes in the changelog.
- The CSS has no JavaScript dependencies. The React entry requires React 19, Base UI and `@tanstack/charts` as peers.
- The vanilla `dialog`, `navigation` and `inventory` modules are deprecated. They receive no new features and will be removed in a future major release.
- Current source intentionally retires the old CSS plot classes. This is a breaking migration for the next package release; see [charts](CHARTS.md). No version bump or publication is implied by the source change.
- Native browser semantics own dialog focus, modality and form controls. Helpers supplement those semantics.

Not verified at 1.0.0: Firefox and Safari behavior on desktop, a full keyboard and assistive-technology review, and physical controller support (the gamepad helper was never tested on hardware). Forced-colors and reduced-motion rules exist but have only had focused Chromium checks. Browser observations are recorded in [status](STATUS.md) with their scope.

The component workshop and HTML Storybook deploy to GitHub Pages from main. The package is published to npm as `@kahwee/runway-ui`.
