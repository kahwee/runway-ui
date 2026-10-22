# Compatibility contract

Runway UI is pre-1.0. This iteration consolidates options and documentation; it is not a declaration of production stability.

- Preserve existing `rw-` classes, package entry points and documented numeric units during patch releases.
- Introduce breaking pre-1.0 changes in a minor release with migration notes. Additive options may appear in patches.
- Defaults work without optional behavior modules. Modules have no runtime dependencies and expose explicit teardown.
- Keep the existing percentage-based `.rw-chart__plot` API separate from the new numeric chart marks.
- Native browser semantics own dialog focus, modality and form controls. Helpers supplement those semantics.

Before 1.0: verify current Chrome, Firefox and Safari on desktop; complete keyboard and assistive-technology review; check forced colors and reduced motion; exercise teardown/remount integration and package consumers; validate documentation recipes. Physical controller support remains unverified on hardware. Browser observations are recorded in STATUS.md with their scope.

The component workshop and HTML Storybook deploy to GitHub Pages from main. The npm package remains unpublished.
