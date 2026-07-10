import { LightningElement, api } from 'lwc';

/**
 * <ui-before-after-chart>
 *
 * Two stacked horizontal bar-chart cards showing a raw distribution and the
 * post-transformation distribution. Uses the "Eclair" chart internals styled
 * with SLDS brand tokens.
 *
 * Two ways to drive content:
 *
 * 1. Preset mode — pass a `transformation` string and get the built-in sample:
 *        <ui-before-after-chart transformation="group-by-month"></ui-before-after-chart>
 *    Valid values: "replace-missing" | "group-by-day" | "group-by-month" | "text-clustering"
 *
 * 2. Custom mode — pass your own row arrays. Each row is
 *    `{ id, label, value, display?, tone? }`.
 *        <ui-before-after-chart
 *            raw-title="Raw distribution"
 *            after-title="After Group by Month"
 *            raw-rows={myRawRows}
 *            after-rows={myAfterRows}
 *        ></ui-before-after-chart>
 *
 * Notes:
 * - Setting `domain-max` locks both charts to the same 0–<max> scale. Default:
 *   each side is normalized to its own max.
 * - The Replace Missing preset renders a single stacked bar on the After card
 *   (82% original + 18% imputed) plus a legend.
 */
export default class BeforeAfterChart extends LightningElement {
    @api rawTitle = 'Raw distribution';
    @api afterTitle = 'After transformation';
    @api rawBadgeLabel = 'Raw';
    @api afterBadgeLabel = 'Example';

    @api transformation = '';

    // Custom overrides
    @api rawRows;
    @api afterRows;
    @api domainMax; // number — force a shared axis maximum

    // --- Preset row datasets ---
    _presetRaw(t) {
        switch (t) {
            case 'replace-missing':
                return [
                    { id: 'raw-present', label: 'Present', value: 82, tone: 'primary', display: '82%' },
                    { id: 'raw-missing', label: 'Missing', value: 18, tone: 'secondary', display: '18%' },
                ];
            case 'group-by-day':
                return [
                    { id: 'd1', label: 'Mon 04', value: 620 },
                    { id: 'd2', label: 'Tue 05', value: 810 },
                    { id: 'd3', label: 'Wed 06', value: 1120, display: '1.1K' },
                    { id: 'd4', label: 'Thu 07', value: 740 },
                    { id: 'd5', label: 'Fri 08', value: 990 },
                    { id: 'd6', label: 'Sat 09', value: 350 },
                    { id: 'd7', label: 'Sun 10', value: 280 },
                ];
            case 'group-by-month':
                return [
                    { id: 'm1', label: 'Jan', value: 12000, display: '12K' },
                    { id: 'm2', label: 'Feb', value: 16500, display: '16.5K' },
                    { id: 'm3', label: 'Mar', value: 21800, display: '21.8K' },
                    { id: 'm4', label: 'Apr', value: 26400, display: '26.4K' },
                    { id: 'm5', label: 'May', value: 18700, display: '18.7K' },
                    { id: 'm6', label: 'Jun', value: 13500, display: '13.5K' },
                ];
            case 'text-clustering':
                return [
                    { id: 't1', label: '"missing item"', value: 142 },
                    { id: 't2', label: '"refund pls"', value: 96 },
                    { id: 't3', label: '"wrong size"', value: 74 },
                    { id: 't4', label: '"not delivered"', value: 58 },
                    { id: 't5', label: '"login help"', value: 44 },
                ];
            default:
                return [];
        }
    }

    _presetAfter(t) {
        switch (t) {
            case 'replace-missing':
                // After side is drawn as a stacked bar (see showStackedAfter).
                return [];
            case 'group-by-day':
                return [
                    { id: 'da1', label: 'Mon 04', value: 620 },
                    { id: 'da2', label: 'Tue 05', value: 810 },
                    { id: 'da3', label: 'Wed 06', value: 1120, display: '1.1K' },
                    { id: 'da4', label: 'Thu 07', value: 740 },
                    { id: 'da5', label: 'Fri 08', value: 990 },
                    { id: 'da6', label: 'Sat 09', value: 350 },
                    { id: 'da7', label: 'Sun 10', value: 280 },
                ];
            case 'group-by-month':
                return [
                    { id: 'ma1', label: 'Jan', value: 12000, display: '12K' },
                    { id: 'ma2', label: 'Feb', value: 16500, display: '16.5K' },
                    { id: 'ma3', label: 'Mar', value: 21800, display: '21.8K' },
                    { id: 'ma4', label: 'Apr', value: 26400, display: '26.4K' },
                    { id: 'ma5', label: 'May', value: 18700, display: '18.7K' },
                    { id: 'ma6', label: 'Jun', value: 13500, display: '13.5K' },
                ];
            case 'text-clustering':
                return [
                    { id: 'tc1', label: 'Shipping & delivery', value: 28, display: '28%' },
                    { id: 'tc2', label: 'Product quality', value: 22, display: '22%' },
                    { id: 'tc3', label: 'Billing & refund', value: 17, display: '17%' },
                    { id: 'tc4', label: 'Positive feedback', value: 13, display: '13%' },
                    { id: 'tc5', label: 'App & login', value: 10, display: '10%' },
                    { id: 'tc6', label: 'Feature requests', value: 6, display: '6%' },
                    { id: 'tc7', label: 'Other', value: 4, display: '4%' },
                ];
            default:
                return [];
        }
    }

    _formatCompact(n) {
        if (n >= 1000) {
            const k = n / 1000;
            return `${k % 1 === 0 ? k : k.toFixed(1)}K`;
        }
        return String(n);
    }

    _decorate(rows, domainMax) {
        if (!rows || !rows.length) return [];
        const max = domainMax || Math.max(...rows.map((r) => r.value));
        return rows.map((r, i) => {
            const tone = r.tone || (i % 2 === 0 ? 'primary' : 'secondary');
            return {
                id: r.id,
                label: r.label,
                barClass: `eclair-bar eclair-bar_${tone}`,
                barStyle: `width: ${Math.max(2, (r.value / max) * 100)}%`,
                displayValue: r.display || this._formatCompact(r.value),
            };
        });
    }

    get resolvedRawRows() {
        const rows = this.rawRows && this.rawRows.length
            ? this.rawRows
            : this._presetRaw(this.transformation);
        return this._decorate(rows, this.domainMax);
    }

    get resolvedAfterRows() {
        const rows = this.afterRows && this.afterRows.length
            ? this.afterRows
            : this._presetAfter(this.transformation);
        return this._decorate(rows, this.domainMax);
    }

    get axisTicks() {
        return [
            { id: 't0', label: '0' },
            { id: 't1', label: '25%' },
            { id: 't2', label: '50%' },
            { id: 't3', label: '75%' },
            { id: 't4', label: '100%' },
        ];
    }

    get showStackedAfter() {
        // Replace-missing preset uses a single stacked bar for the After chart
        // (only when the caller hasn't provided custom afterRows).
        return this.transformation === 'replace-missing'
            && (!this.afterRows || !this.afterRows.length);
    }

    get stackedAfter() {
        return {
            label: 'Filled',
            originalStyle: 'width: 82%',
            imputedStyle: 'width: 18%',
            originalLabel: '82%',
            imputedLabel: '18%',
            legendOriginal: 'Original values',
            legendImputed: 'Imputed with class mean',
        };
    }
}
