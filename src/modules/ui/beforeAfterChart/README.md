# ui-before-after-chart

Two stacked horizontal bar-chart cards showing a raw distribution and the
post-transformation distribution.

## Copy to another project

Copy this folder (`beforeAfterChart/`) into `src/modules/ui/` of the target
project. It has no imports beyond `lwc` and uses `lightning-badge` +
`lightning-icon`, both of which come with the standard LWC OSS setup.

## Preset mode

```html
<ui-before-after-chart transformation="group-by-month"></ui-before-after-chart>
```

Valid `transformation` values: `replace-missing`, `group-by-day`,
`group-by-month`, `text-clustering`.

## Custom mode

```html
<ui-before-after-chart
    raw-title="Raw sessions"
    after-title="After hourly rollup"
    raw-badge-label="Raw"
    after-badge-label="Rolled up"
    raw-rows={myRawRows}
    after-rows={myAfterRows}
></ui-before-after-chart>
```

Each row: `{ id, label, value, display?, tone? }` where `tone` is
`'primary' | 'secondary'`. If `display` is omitted, numbers are formatted
compactly (`1120` → `1.1K`).

Pass `domain-max={100}` (or any number) to lock both charts to the same axis
maximum. Otherwise each side normalizes to its own max.

## Notes

- The Replace Missing preset renders a single stacked bar on the After card
  (82% original + 18% imputed) with a legend. Provide `after-rows` yourself
  if you want normal bars for that transformation.
- Uses SLDS brand tokens (`--slds-g-color-brand-base-60/40`) with hex
  fallbacks — safe to drop into any SLDS 2 host.
