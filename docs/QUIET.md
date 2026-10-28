# Quiet appearance

Set `data-appearance="quiet"` on an `.rw-ui` root to flatten panels, sheets, dossiers, buttons, inputs, folio tabs and leaderboards. Existing themes and default appearances remain unchanged. Colors come from the standard `--rw-*` tokens and can be overridden on the root.

```html
<link rel="stylesheet" href="@kahwee/runway-ui/bundle.css">
<section class="rw-ui" data-theme="ledger" data-appearance="quiet">
  <article class="rw-panel">
    <h2>Team overview</h2>
    <button class="rw-button" data-variant="primary">Review team</button>
  </article>
</section>
```

The full bundle includes this opt-in appearance. For applications with unlayered legacy skins, load `@kahwee/runway-ui/quiet.css` after those skins. This explicit override sheet is intentionally unlayered; the underlying components remain in the library's cascade layers. Higher-specificity host rules still take precedence. Keep viewport layout and domain artwork in the host application.

Visible focus, disabled controls, reduced motion and forced colors are retained. Uses native CSS nesting supported by current desktop browsers; this is presentation only and adds no JavaScript behavior. Try the Quiet story under Compositions / Desk workspace.
