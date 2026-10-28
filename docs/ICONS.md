# Icons

Runway UI draws icons with CSS masks from [Phosphor Icons](https://phosphoricons.com) (MIT). The SVG paths are generated into `styles/icons.css` by `scripts/icons.ts`, so consumers need no icon package and no network request. Phosphor itself is a development dependency only.

```html
<span class="rw-icon" data-icon="rocket" data-weight="duotone" aria-hidden="true"></span>
```

| Attribute     | Values                                                                                                                                                                                                                                                                                                                                                                                                                   | Notes                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `data-icon`   | `x check plus minus caret-* arrow-* sparkle heart star warning info check-circle x-circle circle smiley coins users flask sun rocket package lightning drop leaf trophy flag target clock magnifying-glass gear bell terminal-window keyboard coffee lock arrows-out book-open play pause fast-forward crosshair storefront desktop buildings armchair hard-drives chart-line-up cube compass planet lightbulb confetti` | The generated list; add names in `scripts/icons.ts` and run `node scripts/build.ts`.                                            |
| `data-weight` | omitted (bold), `duotone`, `fill`                                                                                                                                                                                                                                                                                                                                                                                        | Duotone and fill exist for a subset; see the generator.                                                                           |
| `data-size`   | `sm`, `md`, `lg`, `xl`                                                                                                                                                                                                                                                                                                                                                                                                   | Otherwise icons inside text, buttons, badges and links scale to `1.2em`; standalone icons draw a 2px stroke (`--rw-icon-stroke`). |

Icons take `currentColor`, so theme and state colours apply. They are decorative by default: keep `aria-hidden="true"` and give the control an accessible name. Forced colors maps them to `CanvasText`.

Built-in uses: the select picker caret and check badge, the disclosure badge, the switch thumb check, checkboxes, the dialog close button, history event markers, timeseries paging, trend arrows and inventory slots. `@kahwee/runway-ui/inventory` accepts an icon name (or any text) as `item.icon`.

The generated icon stylesheet embeds the SVG masks. Selective consumers who import individual styles can skip it, but the select, disclosure, switch and checkbox skins use its custom properties.

## Fonts

The library loads no fonts. The Whimsy theme's stack prefers Nunito (body) and Fredoka (display) when available, then system rounded fonts (`ui-rounded`, SF Pro Rounded, Varela Round, Hiragino Maru Gothic, Arial Rounded) before `system-ui`. Storybook loads `@fontsource-variable/fredoka` and `@fontsource-variable/nunito` (both SIL OFL, development dependencies) so you can see the intended look; to use them in an app, self-host the same files.
