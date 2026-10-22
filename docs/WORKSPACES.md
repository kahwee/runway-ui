# Desktop workspaces

Use the `ledger` theme for warm paper surfaces, green actions, restrained brass borders and serif display type. Workspace components are included in the full bundle; `runway-ui/workspace.css` exposes the modular styles and requires the usual tokens and control styles.

These components are ordinary semantic HTML and CSS. They introduce no runtime dependencies, automatic navigation, simulation behavior, or viewport gate. Applications own placement, images, state and actions.

| Component                                       | Purpose                                                                  |
| ----------------------------------------------- | ------------------------------------------------------------------------ |
| `.rw-command-bar`                               | A contrasting status bar; identity and metrics remain readable together. |
| `.rw-command-bar__identity`                     | Workspace title and optional identity content.                           |
| `.rw-command-bar__metrics` / `.rw-command-stat` | Aligned metric labels, values and optional notes.                        |
| `.rw-folio-tabs` / `.rw-folio-tab`              | Vertical section navigation using native links or buttons.               |
| `.rw-sheet`                                     | A paper surface for a management section.                                |
| `.rw-dossier-list` / `.rw-dossier`              | Shared columns for descriptive records and their actions.                |
| `.rw-dossier__body`, `__heading`, `__actions`   | Dossier content, status heading and action area.                         |
| `.rw-control-console`                           | A compact wrapping group of time or workflow controls.                   |

```html
<section class="rw-ui" data-theme="ledger">
  <header class="rw-command-bar">
    <strong class="rw-command-bar__identity">Field office</strong>
    <div class="rw-command-bar__metrics">
      <div class="rw-command-stat"><span>Team</span><strong>24</strong></div>
    </div>
  </header>
  <nav class="rw-folio-tabs" aria-label="Workspace sections">
    <a class="rw-folio-tab" href="#people" aria-current="page">People</a>
    <a class="rw-folio-tab" href="#projects">Projects</a>
  </nav>
  <section class="rw-sheet" id="people" aria-labelledby="people-heading">
    <h2 id="people-heading">People</h2>
    <div class="rw-dossier-list">
      <article class="rw-dossier">
        <div class="rw-dossier__body">
          <h3>Operations lead</h3>
          <p>Coordinate the team.</p>
        </div>
        <div class="rw-dossier__actions">
          <button class="rw-button" type="button">Review candidates</button>
        </div>
      </article>
    </div>
  </section>
</section>
```

Dossiers use subgrid to align body and action columns across records. Below a 540px container width, those areas stack in reading order. The host can set the list's grid tracks to suit its content. Give each record a heading and each input an associated label; retain native disabled and focus behavior. Folio navigation uses `aria-current="page"` on the current destination; adding visual classes does not implement the ARIA tab keyboard pattern. Optional images should have empty alt text when the visible destination text already names them.

The command bar's `--rw-command-bg`, `--rw-command-ink` and `--rw-command-muted` customize its contrast. `.rw-folio-tab` accepts `--rw-tab-accent`; other components inherit existing surface, line, spacing and radius tokens. Forced colors restores system surfaces and borders. No animation is required.

See **Compositions / Desk workspace** in Storybook for interactive navigation, editable data and disabled actions. The shared-track example includes a dossier pair.
