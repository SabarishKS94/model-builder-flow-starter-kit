import { LightningElement, track } from 'lwc';
import { navigate } from '../../../router';
import * as Labels from 'data/labels/ClusterBuilder';
import DataViewerModal from 'ui/dataViewerModal';
import { navigate } from '../../../router';

const STEPS = [
    { id: 1, label: Labels.Step1 },
    { id: 2, label: Labels.Step2 },
    { id: 3, label: Labels.Step3 },
    { id: 4, label: Labels.Step4 },
    { id: 5, label: Labels.Step5 },
];

const ACCOUNT_VARIABLES = [
    { id: 'v2', name: 'Annual Revenue', type: 'number', selected: true, action: 'Replace Missing Values', min: 50000, max: 12500000 },
    { id: 'v5', name: 'Employees', type: 'number', min: 1, max: 250000 },
    { id: 'v6', name: 'Global Discount', type: 'number', min: 0, max: 0.45 },
    { id: 'v14', name: 'Account Type', type: 'text', frequencies: [
        { label: 'Customer - Direct', count: 12500 },
        { label: 'Customer - Channel', count: 8200 },
        { label: 'Prospect', count: 4400 },
        { label: 'Other', count: 1100 },
    ] },
    { id: 'v16', name: 'Billing Country', type: 'text', frequencies: [
        { label: 'United States', count: 15800 },
        { label: 'United Kingdom', count: 4200 },
        { label: 'Germany', count: 3100 },
        { label: 'France', count: 2400 },
        { label: 'Japan', count: 1700 },
        { label: 'Canada', count: 1200 },
    ] },
    { id: 'v22', name: 'Industry', type: 'text', frequencies: [
        { label: 'Technology', count: 8400 },
        { label: 'Financial Services', count: 6200 },
        { label: 'Healthcare', count: 4900 },
        { label: 'Manufacturing', count: 3700 },
        { label: 'Retail', count: 2500 },
        { label: 'Education', count: 1100 },
    ] },
    { id: 'v26', name: 'Support Notes', type: 'text', isLargeText: true, avgChars: 3100 },
    { id: 'v8', name: 'Account Description', type: 'text', isLargeText: true, avgChars: 2400 },
    { id: 'v20', name: 'Created Date', type: 'date', selected: true, action: 'Group by Day', min: '1/1/2013, 05:30 AM', max: '1/22/2025, 05:30 AM' },
    { id: 'v21', name: 'Last Activity', type: 'date', selected: true, action: 'Group by Month', min: '4/12/2014, 05:30 AM', max: '6/29/2026, 05:30 AM' },
    { id: 'v24', name: 'Last Modified Date', type: 'date', selected: true, action: 'Group by Month', min: '3/22/2018, 05:30 AM', max: '6/30/2026, 05:30 AM' },
    { id: 'v25', name: 'System Modstamp', type: 'date', selected: true, action: 'Group by Month', min: '3/22/2018, 05:30 AM', max: '6/30/2026, 05:30 AM' },
];

const DATA_MODEL_OBJECTS = [
    { id: 'dmo-1', label: 'Account', apiName: 'AMR_Account__dlm' },
    { id: 'dmo-2', label: 'Account', apiName: 'AMR_Account_WavePM__dlm' },
    { id: 'dmo-3', label: 'Account Contact', apiName: 'AMR_AccountContact__dlm' },
    { id: 'dmo-4', label: 'Attrition', apiName: 'AMR_Attrition__dlm' },
    { id: 'dmo-5', label: 'Contact Point Address', apiName: 'AMR_ContactPointAddress__dlm' },
    { id: 'dmo-6', label: 'Contact Point Email', apiName: 'AMR_ContactPointEmail__dlm' },
    { id: 'dmo-7', label: 'Contact Point Phone', apiName: 'AMR_ContactPointPhone__dlm' },
    { id: 'dmo-8', label: 'Fiscal Calendar WavePM', apiName: 'AMR_FiscalCalendar_WavePM__dlm' },
    { id: 'dmo-9', label: 'FreemanBDT', apiName: 'FreemanBDT__dlm' },
    { id: 'dmo-10', label: 'Individual', apiName: 'AMR_Individual__dlm' },
    { id: 'dmo-11', label: 'Lead', apiName: 'AMR_Lead__dlm' },
    { id: 'dmo-12', label: 'Lead Engagement Signals', apiName: 'Lead_Engagement_Signals__dlm' },
    { id: 'dmo-13', label: 'Opportunity', apiName: 'AMR_Opportunity__dlm' },
    { id: 'dmo-14', label: 'Case', apiName: 'AMR_Case__dlm' },
];

export default class ClusterBuilder extends LightningElement {
    labels = Labels;
    @track currentStep = 1;
    @track showLeftPanel = true;
    @track showRightPanel = true;
    @track dmoSearchTerm = '';
    @track showDmoDropdown = false;
    @track selectedDmo = null;
    @track filterSelection = 'all';
    @track variableSearchTerm = '';
    @track showOnlySelected = false;
    @track accountSectionOpen = true;
    @track selectedVariableIds = new Set(['v2', 'v20', 'v21', 'v24', 'v25']);
    @track variableActions = {
        v2: 'Replace Missing Values',
        v20: 'Group by Day',
        v21: 'Group by Month',
        v24: 'Group by Month',
        v25: 'Group by Month',
    };
    @track activeVariableId = null;
    @track variantMode = 'f';
    @track variantPickerOpen = false;
    @track variantPickerSearch = '';
    @track variableTransformations = {
        v20: 'group-by-day',
        v21: 'group-by-month',
        v24: 'group-by-month',
        v25: 'group-by-month',
        v2: 'replace-missing',
    };
    @track variableReplaceWith = { v2: 'average' };
    @track variableGroupBy = { v2: 'account-name' };
    @track variableBuckets = {};
    @track selectedAlgorithm = 'kmeans';
    @track autoClusterEnabled = true;
    @track numberOfClusters = 4;
    @track modelName = Labels.ModelNameValue;
    @track clusterDescription = Labels.ClusterDescriptionValue;
    @track activeArticleId = null;
    @track isTraining = false;
    @track isAgentforceOpen = false;
    @track isLocked = import.meta.env.VITE_LOCKED === '1';

    connectedCallback() {
        try {
            let queryString = window.location.search || '';
            if (!queryString && window.location.hash) {
                const hashQueryIdx = window.location.hash.indexOf('?');
                if (hashQueryIdx !== -1) {
                    queryString = window.location.hash.slice(hashQueryIdx);
                }
            }
            const params = new URLSearchParams(queryString);
            const stepParam = parseInt(params.get('step'), 10);
            if (!isNaN(stepParam) && stepParam >= 1 && stepParam <= 5) {
                this.currentStep = stepParam;
            }
            const variantParam = (params.get('variant') || '').toLowerCase();
            if (variantParam === 'f' || variantParam === 'g') {
                this.variantMode = variantParam;
                if (!this.activeVariableId) {
                    this.activeVariableId = ACCOUNT_VARIABLES[0].id;
                }
            }
            if (params.get('locked') === '1') {
                this.isLocked = true;
            } else if (params.get('locked') === '0') {
                this.isLocked = false;
            }
        } catch (e) {
            // ignore
        }
    }

    get shellClass() {
        return this.isLocked ? 'builder-shell builder-shell_locked' : 'builder-shell';
    }

    get steps() {
        return STEPS.map((step) => {
            const isActive = step.id === this.currentStep;
            const isComplete = step.id < this.currentStep;
            let iconName = 'utility:routing_offline';
            let iconClass = 'step-icon step-icon_pending';
            if (isActive) {
                iconName = 'utility:choice';
                iconClass = 'step-icon step-icon_active';
            }
            return {
                ...step,
                number: step.id,
                isComplete,
                itemClass: `step-item${isActive ? ' step-item_active' : ''}${isComplete ? ' step-item_complete' : ''}`,
                iconName,
                iconClass,
                labelClass: isActive ? 'step-label step-label_active' : 'step-label',
            };
        });
    }

    get isStep1() {
        return this.currentStep === 1;
    }

    get isStep2() {
        return this.currentStep === 2;
    }

    get isStep3() {
        return this.currentStep === 3;
    }

    get isStep4() {
        return this.currentStep === 4;
    }

    get isStep5() {
        return this.currentStep === 5;
    }

    get reviewAlgorithmValue() {
        return this.selectedAlgorithm === 'hdbscan' ? Labels.ReviewAlgorithmValueHDBScan : Labels.ReviewAlgorithmValueKMeans;
    }

    get reviewVariablesInfo() {
        return `${this.selectedCount} of ${this.totalVariableCount} variables selected`;
    }

    get reviewFilterRecords() {
        return this.filterSelection === 'filtered'
            ? '504 of 1000000 records will be used to train the model'
            : '1000000 of 1000000 records will be used to train the model';
    }

    get reviewDmoValue() {
        return this.selectedDmo ? this.selectedDmo.label : 'Account';
    }

    get nextButtonLabel() {
        return this.currentStep === 5 ? Labels.SaveTrainButton : Labels.NextButton;
    }

    get nextButtonIcon() {
        return this.currentStep === 5 ? 'utility:einstein' : null;
    }

    get isFinalStep() {
        return this.currentStep === 5;
    }

    get previousButtonLabel() {
        return this.currentStep === 5 ? Labels.BackButton : Labels.PreviousButton;
    }

    get panelBadgeIcon() {
        return this.currentStep === 5 ? 'utility:fallback' : 'utility:edit';
    }

    get panelBadgeClass() {
        return this.currentStep === 5 ? 'panel-icon-badge panel-icon-badge_train' : 'panel-icon-badge';
    }

    get isKMeansSelected() {
        return this.selectedAlgorithm === 'kmeans';
    }

    get isHdbscanSelected() {
        return this.selectedAlgorithm === 'hdbscan';
    }

    get autoClusterToggleText() {
        return this.autoClusterEnabled ? Labels.AutoClusterEnabled : Labels.AutoClusterDisabled;
    }

    get showNumberOfClusters() {
        return this.selectedAlgorithm === 'kmeans' && !this.autoClusterEnabled;
    }

    get decrementDisabled() {
        return this.numberOfClusters <= 2;
    }

    get incrementDisabled() {
        return this.numberOfClusters >= 10;
    }

    get filteredVariables() {
        const term = this.variableSearchTerm.toLowerCase();
        return ACCOUNT_VARIABLES.filter((v) => {
            if (this.showOnlySelected && !this.selectedVariableIds.has(v.id)) return false;
            if (term && !v.name.toLowerCase().includes(term)) return false;
            return true;
        }).map((v) => {
            const isSelected = this.selectedVariableIds.has(v.id);
            let iconName = 'utility:text';
            if (v.type === 'number') iconName = 'utility:number_input';
            else if (v.type === 'date') iconName = 'utility:event';
            if (v.isLargeText) iconName = 'utility:richtextindent';
            const action = this.variableActions[v.id] || null;
            const isExpanded = this.variantMode === 'c' && this.activeVariableId === v.id;
            const isPickerActive = (this.variantMode === 'b' || this.variantMode === 'b2' || this.variantMode === 'd' || this.variantMode === 'e' || this.variantMode === 'f' || this.variantMode === 'g') && this.effectiveActiveVariableId === v.id;
            let rowClass = 'var-row';
            if (this.variantMode === 'b' || this.variantMode === 'b2' || this.variantMode === 'd' || this.variantMode === 'e' || this.variantMode === 'f' || this.variantMode === 'g') rowClass += ' var-row_no-settings';
            if (isSelected) rowClass += ' var-row_selected';
            if (isExpanded) rowClass += ' var-row_expanded';
            if (isPickerActive) rowClass += ' var-row_picker-active';
            let openIconName = 'utility:forward';
            let openAltText = 'Open settings';
            if (this.variantMode === 'c') {
                openIconName = isExpanded ? 'utility:chevrondown' : 'utility:chevronright';
                openAltText = isExpanded ? 'Collapse settings' : 'Expand settings';
            }
            return {
                ...v,
                isSelected,
                action,
                actionLabel: action,
                actionVariant: 'neutral',
                iconName,
                showLargeTextInfo: !!v.isLargeText,
                rowClass,
                showDelete: v.type !== 'date',
                isExpanded,
                openIconName,
                openAltText,
            };
        });
    }

    get selectedCount() {
        return this.selectedVariableIds.size;
    }

    get totalVariableCount() {
        return ACCOUNT_VARIABLES.length;
    }

    get selectedSummary() {
        return `${this.selectedCount} of ${this.totalVariableCount} selected`;
    }

    get accountToggleIcon() {
        return this.accountSectionOpen ? 'utility:chevronup' : 'utility:chevrondown';
    }

    get showOnlySelectedVariant() {
        return this.showOnlySelected ? 'brand' : 'neutral';
    }

    get activeVariable() {
        const id = this.effectiveActiveVariableId;
        if (!id) return null;
        return ACCOUNT_VARIABLES.find((v) => v.id === id) || null;
    }

    get isVariablePanelOpen() {
        if (this.currentStep === 3 && (this.variantMode === 'b' || this.variantMode === 'b2' || this.variantMode === 'd' || this.variantMode === 'e' || this.variantMode === 'f' || this.variantMode === 'g')) return true;
        if (this.currentStep === 3 && this.variantMode === 'c') return false;
        return !!this.activeVariable;
    }

    get effectiveActiveVariableId() {
        if (this.currentStep === 3 && (this.variantMode === 'b' || this.variantMode === 'b2' || this.variantMode === 'd' || this.variantMode === 'e' || this.variantMode === 'f' || this.variantMode === 'g')) {
            return this.activeVariableId || ACCOUNT_VARIABLES[0].id;
        }
        return this.activeVariableId;
    }

    get isVariantA() { return this.variantMode === 'a'; }
    get isVariantB() { return this.variantMode === 'b'; }
    get isVariantB2() { return this.variantMode === 'b2'; }
    get isVariantC() { return this.variantMode === 'c'; }
    get isVariantD() { return this.variantMode === 'd'; }
    get isVariantE() { return this.variantMode === 'e'; }
    get isVariantF() { return this.variantMode === 'f'; }
    get isVariantG() { return this.variantMode === 'g'; }
    get isVariantBLike() { return this.variantMode === 'b' || this.variantMode === 'b2' || this.variantMode === 'd' || this.variantMode === 'e' || this.variantMode === 'f' || this.variantMode === 'g'; }
    get hideSettingsColumn() { return this.isVariantBLike; }
    get showSettingsColumn() { return !this.isVariantBLike; }
    get variableNameAsLink() { return this.isVariantBLike; }
    get varTableHeadClass() { return this.hideSettingsColumn ? 'var-table-head var-table-head_no-settings' : 'var-table-head'; }
    get variantAChipClass() { return `variant-chip${this.isVariantA ? ' variant-chip_active' : ''}`; }
    get variantBChipClass() { return `variant-chip${this.isVariantB ? ' variant-chip_active' : ''}`; }
    get variantB2ChipClass() { return `variant-chip${this.isVariantB2 ? ' variant-chip_active' : ''}`; }
    get variantCChipClass() { return `variant-chip${this.isVariantC ? ' variant-chip_active' : ''}`; }
    get variantDChipClass() { return `variant-chip${this.isVariantD ? ' variant-chip_active' : ''}`; }
    get variantEChipClass() { return `variant-chip${this.isVariantE ? ' variant-chip_active' : ''}`; }
    get variantFChipClass() { return `variant-chip${this.isVariantF ? ' variant-chip_active' : ''}`; }
    get variantGChipClass() { return `variant-chip${this.isVariantG ? ' variant-chip_active' : ''}`; }

    get variantPickerOptions() {
        const term = (this.variantPickerSearch || '').toLowerCase();
        return ACCOUNT_VARIABLES
            .filter((v) => !term || v.name.toLowerCase().includes(term))
            .map((v) => ({
                id: v.id,
                name: v.name,
                itemClass: `variant-picker-item${v.id === this.effectiveActiveVariableId ? ' variant-picker-item_active' : ''}`,
            }));
    }

    get variantPickerButtonLabel() {
        const v = this.activeVariable;
        return v ? v.name : 'Select a variable';
    }

    get activeTransformation() {
        const id = this.effectiveActiveVariableId;
        if (!id) return 'none';
        if (this.variableTransformations[id]) {
            return this.variableTransformations[id];
        }
        const v = this.activeVariable;
        if (v && v.type === 'date') return 'group-by-day';
        return 'none';
    }

    get transformationOptions() {
        const v = this.activeVariable;
        if (!v) return [];
        if (v.type === 'text') {
            return [
                { label: Labels.TransformationNone, value: 'none' },
                { label: Labels.TransformationTextClustering, value: 'text-clustering' },
            ];
        }
        if (v.type === 'date') {
            return [
                { label: Labels.TransformationGroupByDay, value: 'group-by-day' },
                { label: Labels.TransformationGroupByMonth, value: 'group-by-month' },
            ];
        }
        return [
            { label: Labels.TransformationNone, value: 'none' },
            { label: Labels.TransformationReplaceMissing, value: 'replace-missing' },
        ];
    }

    get isActiveVariableNumber() {
        const v = this.activeVariable;
        return !!v && v.type === 'number';
    }

    get isActiveVariableText() {
        const v = this.activeVariable;
        return !!v && v.type === 'text';
    }

    get isActiveVariableDate() {
        const v = this.activeVariable;
        return !!v && v.type === 'date';
    }

    get showNumberBuckets() {
        return this.isActiveVariableNumber;
    }

    get activeBucketCount() {
        const id = this.effectiveActiveVariableId;
        if (!id) return 10;
        return this.variableBuckets[id] || 10;
    }

    get textFrequencies() {
        const v = this.activeVariable;
        if (!v || v.type !== 'text' || !v.frequencies) return [];
        const max = Math.max(...v.frequencies.map((f) => f.count));
        return v.frequencies.map((f) => ({
            label: f.label,
            count: this.formatCount(f.count),
            barStyle: `width: ${Math.max(2, (f.count / max) * 100)}%`,
        }));
    }

    get showTextFrequencyChart() {
        const v = this.activeVariable;
        return !!v && v.type === 'text' && !!v.frequencies && v.frequencies.length > 0;
    }

    formatCount(n) {
        if (n >= 1000) {
            const k = n / 1000;
            return `${k % 1 === 0 ? k : k.toFixed(1)}K`;
        }
        return String(n);
    }

    get showB2ReplaceSample() {
        return this.isVariantB2 && this.activeTransformation === 'replace-missing';
    }

    get showB2DaySample() {
        return this.isVariantB2 && this.activeTransformation === 'group-by-day';
    }

    get showB2MonthSample() {
        return this.isVariantB2 && this.activeTransformation === 'group-by-month';
    }

    get showB2TextSample() {
        return this.isVariantB2 && this.activeTransformation === 'text-clustering';
    }

    get showB2AnySample() {
        return this.showB2ReplaceSample || this.showB2DaySample || this.showB2MonthSample || this.showB2TextSample;
    }

    get showDReplaceSample() { return this.isVariantD && this.activeTransformation === 'replace-missing'; }
    get showDDaySample() { return this.isVariantD && this.activeTransformation === 'group-by-day'; }
    get showDMonthSample() { return this.isVariantD && this.activeTransformation === 'group-by-month'; }
    get showDTextSample() { return this.isVariantD && this.activeTransformation === 'text-clustering'; }
    get showDAnySample() { return this.showDReplaceSample || this.showDDaySample || this.showDMonthSample || this.showDTextSample; }

    // Variant E — always-on preview. Defaults to the first applicable
    // transformation for the variable type when the user hasn't picked one.
    get effectiveETransformation() {
        const t = this.activeTransformation;
        if (t && t !== 'none') return t;
        const v = this.activeVariable;
        if (!v) return 'replace-missing';
        if (v.type === 'text') return 'text-clustering';
        if (v.type === 'date') return 'group-by-day';
        return 'replace-missing';
    }
    get showEReplaceSample() { return this.isVariantE && this.effectiveETransformation === 'replace-missing'; }
    get showEDaySample() { return this.isVariantE && this.effectiveETransformation === 'group-by-day'; }
    get showEMonthSample() { return this.isVariantE && this.effectiveETransformation === 'group-by-month'; }
    get showETextSample() { return this.isVariantE && this.effectiveETransformation === 'text-clustering'; }
    get showEAnySample() { return this.isVariantE; }
    get showEChartSample() { return this.isVariantE; }

    // Variant F — SLDS-only preview. Reuses effectiveETransformation for defaults.
    get effectiveFTransformation() {
        const t = this.activeTransformation;
        if (t && t !== 'none') return t;
        const v = this.activeVariable;
        if (!v) return 'replace-missing';
        if (v.type === 'text') return 'text-clustering';
        if (v.type === 'date') return 'group-by-day';
        return 'replace-missing';
    }
    get showFReplaceSample() { return this.isVariantF && this.effectiveFTransformation === 'replace-missing'; }
    get showFDaySample() { return this.isVariantF && this.effectiveFTransformation === 'group-by-day'; }
    get showFMonthSample() { return this.isVariantF && this.effectiveFTransformation === 'group-by-month'; }
    get showFTextSample() { return this.isVariantF && this.effectiveFTransformation === 'text-clustering'; }
    get showFAnySample() { return this.isVariantF; }
    get fRawTitle() {
        if (this.showFReplaceSample) return 'Raw distribution';
        if (this.showFDaySample || this.showFMonthSample) return 'Raw distribution';
        if (this.showFTextSample) return 'Top raw values';
        return '';
    }
    get fAfterTitle() {
        if (this.showFReplaceSample) return 'After transformation';
        if (this.showFDaySample) return 'After Group by Day';
        if (this.showFMonthSample) return 'After Group by Month';
        if (this.showFTextSample) return 'After Text Clustering';
        return '';
    }

    // SLDS-only preview rows. Each row has label, value (0-100 for progress-bar),
    // displayValue for the trailing text, and an optional accent variant.
    _fRows(rows, domainMax) {
        const max = domainMax || Math.max(...rows.map((r) => r.raw));
        return rows.map((r) => ({
            id: r.id,
            label: r.label,
            display: r.display,
            value: Math.max(1, Math.round((r.raw / max) * 100)),
            variant: r.variant || 'base',
        }));
    }

    get fRawReplaceRows() {
        return this._fRows([
            { id: 'fr-p', label: 'Present', raw: 82, display: '82%' },
            { id: 'fr-m', label: 'Missing', raw: 18, display: '18%', variant: 'warning' },
        ], 100);
    }

    get fAfterReplace() {
        return {
            originalPct: 82,
            imputedPct: 18,
            originalLabel: '82% original',
            imputedLabel: '18% imputed',
        };
    }

    get fRawDayRows() {
        return this._fRows([
            { id: 'frd1', label: 'Mon 04', raw: 620, display: '620' },
            { id: 'frd2', label: 'Tue 05', raw: 810, display: '810' },
            { id: 'frd3', label: 'Wed 06', raw: 1100, display: '1.1K' },
            { id: 'frd4', label: 'Thu 07', raw: 740, display: '740' },
            { id: 'frd5', label: 'Fri 08', raw: 990, display: '990' },
            { id: 'frd6', label: 'Sat 09', raw: 350, display: '350' },
            { id: 'frd7', label: 'Sun 10', raw: 280, display: '280' },
        ]);
    }
    get fAfterDayRows() {
        return this._fRows([
            { id: 'fad1', label: 'Mon 04', raw: 620, display: '620' },
            { id: 'fad2', label: 'Tue 05', raw: 810, display: '810' },
            { id: 'fad3', label: 'Wed 06', raw: 1100, display: '1.1K' },
            { id: 'fad4', label: 'Thu 07', raw: 740, display: '740' },
            { id: 'fad5', label: 'Fri 08', raw: 990, display: '990' },
            { id: 'fad6', label: 'Sat 09', raw: 350, display: '350' },
            { id: 'fad7', label: 'Sun 10', raw: 280, display: '280' },
        ]);
    }

    get fRawMonthRows() {
        return this._fRows([
            { id: 'frm1', label: 'Jan', raw: 12000, display: '12K' },
            { id: 'frm2', label: 'Feb', raw: 16500, display: '16.5K' },
            { id: 'frm3', label: 'Mar', raw: 21800, display: '21.8K' },
            { id: 'frm4', label: 'Apr', raw: 26400, display: '26.4K' },
            { id: 'frm5', label: 'May', raw: 18700, display: '18.7K' },
            { id: 'frm6', label: 'Jun', raw: 13500, display: '13.5K' },
        ]);
    }
    get fAfterMonthRows() {
        return this._fRows([
            { id: 'fam1', label: 'Jan', raw: 12000, display: '12K' },
            { id: 'fam2', label: 'Feb', raw: 16500, display: '16.5K' },
            { id: 'fam3', label: 'Mar', raw: 21800, display: '21.8K' },
            { id: 'fam4', label: 'Apr', raw: 26400, display: '26.4K' },
            { id: 'fam5', label: 'May', raw: 18700, display: '18.7K' },
            { id: 'fam6', label: 'Jun', raw: 13500, display: '13.5K' },
        ]);
    }

    get fRawTextRows() {
        return this._fRows([
            { id: 'frt1', label: '"missing item"', raw: 142, display: '142' },
            { id: 'frt2', label: '"refund pls"', raw: 96, display: '96' },
            { id: 'frt3', label: '"wrong size"', raw: 74, display: '74' },
            { id: 'frt4', label: '"not delivered"', raw: 58, display: '58' },
            { id: 'frt5', label: '"login help"', raw: 44, display: '44' },
        ]);
    }
    get fAfterTextRows() {
        return this._fRows([
            { id: 'fat1', label: 'Renewal question', raw: 32, display: '32%' },
            { id: 'fat2', label: 'Product issue', raw: 24, display: '24%' },
            { id: 'fat3', label: 'Billing dispute', raw: 18, display: '18%' },
            { id: 'fat4', label: 'Onboarding help', raw: 14, display: '14%' },
            { id: 'fat5', label: 'Other', raw: 12, display: '12%' },
        ], 100);
    }

    // Variant G — vertical mini bars, Before / After side-by-side.
    get effectiveGTransformation() {
        const t = this.activeTransformation;
        if (t && t !== 'none') return t;
        const v = this.activeVariable;
        if (!v) return 'replace-missing';
        if (v.type === 'text') return 'text-clustering';
        if (v.type === 'date') return 'group-by-day';
        return 'replace-missing';
    }
    get showGReplaceSample() { return this.isVariantG && this.effectiveGTransformation === 'replace-missing'; }
    get showGDaySample() { return this.isVariantG && this.effectiveGTransformation === 'group-by-day'; }
    get showGMonthSample() { return this.isVariantG && this.effectiveGTransformation === 'group-by-month'; }
    get showGTextSample() { return this.isVariantG && this.effectiveGTransformation === 'text-clustering'; }
    get showGAnySample() { return this.isVariantG; }

    get gBeforeCaption() {
        if (this.showGReplaceSample) return '18% of rows missing a value';
        if (this.showGDaySample) return 'Raw dates — thousands of unique values';
        if (this.showGMonthSample) return 'Raw dates — thousands of unique values';
        if (this.showGTextSample) return 'Free-text — every response unique';
        return '';
    }
    get gAfterCaption() {
        if (this.showGReplaceSample) return 'Filled with average per industry';
        if (this.showGDaySample) return 'Grouped by day';
        if (this.showGMonthSample) return 'Grouped by month';
        if (this.showGTextSample) return 'Clustered into 5 categories';
        return '';
    }

    // Risk copy — per-transformation, shared by Variant F and G skip warnings.
    _riskCopyFor(transformation) {
        switch (transformation) {
            case 'replace-missing':
                return 'Skipping drops 18% of rows from training and can bias the model toward the majority segment.';
            case 'group-by-day':
                return 'Skipping keeps thousands of unique dates — the model treats each day as its own category and overfits.';
            case 'group-by-month':
                return 'Skipping keeps thousands of unique dates — the model treats each day as its own category and overfits.';
            case 'text-clustering':
                return 'Skipping keeps every free-text response unique — the model has no signal to learn from.';
            default:
                return '';
        }
    }
    get fSkipRisk() { return this.isVariantF ? this._riskCopyFor(this.effectiveFTransformation) : ''; }
    get gSkipRisk() { return this.isVariantG ? this._riskCopyFor(this.effectiveGTransformation) : ''; }
    get showFSkipRisk() { return !!this.fSkipRisk; }
    get showGSkipRisk() { return !!this.gSkipRisk; }

    _gBar(id, heightPct, state) {
        // state: 'normal' | 'missing' | 'filled'
        const cls = state === 'missing'
            ? 'g-bar g-bar_missing'
            : state === 'filled'
                ? 'g-bar g-bar_filled'
                : 'g-bar';
        return { id, style: `height: ${heightPct}%`, cls };
    }

    // --- Replace missing: same shape both sides; 2 bars hatched Before, green After ---
    get gReplaceBefore() {
        return [
            this._gBar('r1', 45, 'normal'),
            this._gBar('r2', 72, 'normal'),
            this._gBar('r3', 60, 'missing'),
            this._gBar('r4', 55, 'normal'),
            this._gBar('r5', 82, 'normal'),
            this._gBar('r6', 60, 'missing'),
            this._gBar('r7', 68, 'normal'),
            this._gBar('r8', 40, 'normal'),
        ];
    }
    get gReplaceAfter() {
        return [
            this._gBar('a1', 45, 'normal'),
            this._gBar('a2', 72, 'normal'),
            this._gBar('a3', 60, 'filled'),
            this._gBar('a4', 55, 'normal'),
            this._gBar('a5', 82, 'normal'),
            this._gBar('a6', 60, 'filled'),
            this._gBar('a7', 68, 'normal'),
            this._gBar('a8', 40, 'normal'),
        ];
    }

    // --- Date group-by-day: many spiky bars Before → smoother pattern After ---
    get gDayBefore() {
        return [12, 8, 22, 6, 30, 14, 4, 18, 10, 26, 8, 20].map((h, i) => this._gBar(`db${i}`, h * 3, 'normal'));
    }
    get gDayAfter() {
        return [45, 60, 82, 55, 70, 25, 20].map((h, i) => this._gBar(`da${i}`, h, 'normal'));
    }

    // --- Date group-by-month: same idea, fewer bars After ---
    get gMonthBefore() {
        return [12, 8, 22, 6, 30, 14, 4, 18, 10, 26, 8, 20].map((h, i) => this._gBar(`mb${i}`, h * 3, 'normal'));
    }
    get gMonthAfter() {
        return [40, 55, 72, 88, 62, 45].map((h, i) => this._gBar(`ma${i}`, h, 'normal'));
    }

    // --- Text clustering: scattered Before → grouped After ---
    get gTextBefore() {
        return [22, 30, 18, 24, 28, 20, 16, 26, 22, 30].map((h, i) => this._gBar(`tb${i}`, h * 2.5, 'normal'));
    }
    get gTextAfter() {
        return [64, 48, 36, 28, 24].map((h, i) => this._gBar(`ta${i}`, h, 'normal'));
    }
    get eSampleTitle() {
        if (this.showEReplaceSample) return 'Missing values will be filled per group';
        if (this.showEDaySample) return 'Dates will be grouped by day';
        if (this.showEMonthSample) return 'Dates will be grouped by month';
        if (this.showETextSample) return 'Free text will collapse into categories';
        return '';
    }
    get eRawTitle() {
        if (this.showEReplaceSample) return 'Raw distribution';
        if (this.showEDaySample) return 'Raw distribution';
        if (this.showEMonthSample) return 'Raw distribution';
        if (this.showETextSample) return 'Top raw values';
        return '';
    }
    get eAfterTitle() {
        if (this.showEReplaceSample) return 'After transformation';
        if (this.showEDaySample) return 'After Group by Day';
        if (this.showEMonthSample) return 'After Group by Month';
        if (this.showETextSample) return 'After Text Clustering';
        return '';
    }
    get dSampleTitle() {
        if (this.showDReplaceSample) return 'Missing values will be filled per group';
        if (this.showDDaySample) return 'Dates will be grouped by day';
        if (this.showDMonthSample) return 'Dates will be grouped by month';
        if (this.showDTextSample) return 'Free text will collapse into categories';
        return '';
    }
    get dSampleSummary() {
        if (this.showDReplaceSample) return 'Rows with a missing value will use the group average — 18% of your rows.';
        if (this.showDDaySample) return '4,400+ dates → ~2,900 day buckets. Fine-grained but sparse.';
        if (this.showDMonthSample) return '4,400+ dates → 148 month buckets. Denser groups, easier to cluster.';
        if (this.showDTextSample) return 'Free text → 5 categories representing 100% of your rows.';
        return '';
    }

    get b2ReplaceBeforeBars() {
        // Ragged bars with a visible gap = missing
        return [
            { id: 'b1', style: 'height: 62%' },
            { id: 'b2', style: 'height: 78%' },
            { id: 'b3', style: 'height: 0%', isMissing: true, missingClass: 'b2-mini-bar b2-mini-bar_missing' },
            { id: 'b4', style: 'height: 54%' },
            { id: 'b5', style: 'height: 82%' },
            { id: 'b6', style: 'height: 0%', isMissing: true, missingClass: 'b2-mini-bar b2-mini-bar_missing' },
            { id: 'b7', style: 'height: 70%' },
            { id: 'b8', style: 'height: 45%' },
        ].map((b) => ({ ...b, barClass: b.isMissing ? 'b2-mini-bar b2-mini-bar_missing' : 'b2-mini-bar' }));
    }

    get b2ReplaceAfterBars() {
        // Filled-in bars — previously missing slots now filled at median-ish
        return [
            { id: 'a1', style: 'height: 62%', filled: false },
            { id: 'a2', style: 'height: 78%', filled: false },
            { id: 'a3', style: 'height: 60%', filled: true },
            { id: 'a4', style: 'height: 54%', filled: false },
            { id: 'a5', style: 'height: 82%', filled: false },
            { id: 'a6', style: 'height: 60%', filled: true },
            { id: 'a7', style: 'height: 70%', filled: false },
            { id: 'a8', style: 'height: 45%', filled: false },
        ].map((b) => ({ ...b, barClass: b.filled ? 'b2-mini-bar b2-mini-bar_filled' : 'b2-mini-bar' }));
    }

    get b2DayBuckets() {
        return [
            { id: 'd1', label: 'Mon 04', style: 'height: 45%' },
            { id: 'd2', label: 'Tue 05', style: 'height: 60%' },
            { id: 'd3', label: 'Wed 06', style: 'height: 82%' },
            { id: 'd4', label: 'Thu 07', style: 'height: 55%' },
            { id: 'd5', label: 'Fri 08', style: 'height: 70%' },
            { id: 'd6', label: 'Sat 09', style: 'height: 25%' },
            { id: 'd7', label: 'Sun 10', style: 'height: 20%' },
        ];
    }

    get b2MonthBuckets() {
        return [
            { id: 'm1', label: 'Jan', style: 'height: 40%' },
            { id: 'm2', label: 'Feb', style: 'height: 55%' },
            { id: 'm3', label: 'Mar', style: 'height: 72%' },
            { id: 'm4', label: 'Apr', style: 'height: 88%' },
            { id: 'm5', label: 'May', style: 'height: 62%' },
            { id: 'm6', label: 'Jun', style: 'height: 45%' },
        ];
    }

    get b2TextCategories() {
        return [
            { id: 't1', label: 'Renewal question', count: '32%' },
            { id: 't2', label: 'Product issue', count: '24%' },
            { id: 't3', label: 'Billing dispute', count: '18%' },
            { id: 't4', label: 'Onboarding help', count: '14%' },
            { id: 't5', label: 'Other', count: '12%' },
        ];
    }

    get dTextClusters() {
        const rows = [
            { id: 'tc1', label: 'Shipping & delivery issues', value: 28, tone: 'primary' },
            { id: 'tc2', label: 'Product quality complaints', value: 22, tone: 'secondary' },
            { id: 'tc3', label: 'Billing & refund requests', value: 17, tone: 'primary' },
            { id: 'tc4', label: 'Positive feedback & praise', value: 13, tone: 'secondary' },
            { id: 'tc5', label: 'App & login problems', value: 10, tone: 'primary' },
            { id: 'tc6', label: 'Feature requests', value: 6, tone: 'secondary' },
            { id: 'tc7', label: 'Other / uncategorized', value: 4, tone: 'primary' },
        ];
        return this._toEclairRows(rows, '%');
    }

    get dDayEclair() {
        const rows = [
            { id: 'd1', label: 'Mon 04', value: 620, tone: 'primary' },
            { id: 'd2', label: 'Tue 05', value: 810, tone: 'secondary' },
            { id: 'd3', label: 'Wed 06', value: 1120, tone: 'primary' },
            { id: 'd4', label: 'Thu 07', value: 740, tone: 'secondary' },
            { id: 'd5', label: 'Fri 08', value: 990, tone: 'primary' },
            { id: 'd6', label: 'Sat 09', value: 350, tone: 'secondary' },
            { id: 'd7', label: 'Sun 10', value: 280, tone: 'primary' },
        ];
        return this._toEclairRows(rows, '');
    }

    get dMonthEclair() {
        const rows = [
            { id: 'm1', label: 'Jan', value: 12000, tone: 'primary' },
            { id: 'm2', label: 'Feb', value: 16500, tone: 'secondary' },
            { id: 'm3', label: 'Mar', value: 21800, tone: 'primary' },
            { id: 'm4', label: 'Apr', value: 26400, tone: 'secondary' },
            { id: 'm5', label: 'May', value: 18700, tone: 'primary' },
            { id: 'm6', label: 'Jun', value: 13500, tone: 'secondary' },
        ];
        return this._toEclairRows(rows, '');
    }

    get dReplaceEclair() {
        // Before / After stacked as two rows in the same chart — 0–100% axis
        const rows = [
            { id: 'r-before', label: 'Before', value: 82, tone: 'secondary', display: '82% filled' },
            { id: 'r-after', label: 'After', value: 100, tone: 'primary', display: '100% filled' },
        ];
        return this._toEclairRows(rows, '', 100);
    }

    get dReplaceStacked() {
        // Single stacked bar for the After chart: 82% original (solid) +
        // 18% imputed (tinted-navy hatched, so the bar reads as one variable).
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

    _toEclairRows(rows, suffix, domainMax) {
        const max = domainMax || Math.max(...rows.map((r) => r.value));
        return rows.map((r) => ({
            ...r,
            barStyle: `width: ${Math.max(2, (r.value / max) * 100)}%`,
            barClass: `eclair-bar eclair-bar_${r.tone}`,
            displayValue: r.display || this._formatCompact(r.value, suffix),
        }));
    }

    _formatCompact(n, suffix) {
        if (suffix === '%') return `${n}%`;
        if (n >= 1000) {
            const k = n / 1000;
            return `${k % 1 === 0 ? k : k.toFixed(1)}K`;
        }
        return String(n);
    }

    get dEclairTicks() {
        // Simple 5-tick axis, purely decorative
        return [
            { id: 't0', label: '0' },
            { id: 't1', label: '25%' },
            { id: 't2', label: '50%' },
            { id: 't3', label: '75%' },
            { id: 't4', label: '100%' },
        ];
    }

    // ---- Raw data previews (before transformation) ----
    // Blog says the Settings panel shows raw distribution; the transformation
    // effect chart shows post-transformation. Both live side-by-side in E.
    get rawReplaceEclair() {
        // Raw distribution for a number field with missing values —
        // shown as a "% present" bar for the source variable.
        const rows = [
            { id: 'raw-present', label: 'Present', value: 82, tone: 'secondary', display: '82%' },
            { id: 'raw-missing', label: 'Missing', value: 18, tone: 'muted', display: '18%' },
        ];
        return this._toEclairRows(rows, '', 100);
    }

    // Class-based mean imputation preview — dot plot on a number line per class.
    // Present rows are solid dots at their value. The class mean is a vertical
    // line. Missing rows show as an open (hollow) dot at the mean position.
    // Domain is a shared 0–$15M axis so class differences are visible.
    get eImputationPlot() {
        const domainMax = 15; // $M
        const pct = (v) => (v / domainMax) * 100;
        const leftStyle = (p) => `left: ${p.toFixed(2)}%;`;
        return {
            axisLabels: [
                { id: 'ax0', label: '$0', style: leftStyle(0) },
                { id: 'ax5', label: '$5M', style: leftStyle(pct(5)) },
                { id: 'ax10', label: '$10M', style: leftStyle(pct(10)) },
                { id: 'ax15', label: '$15M', style: leftStyle(100) },
            ],
            groups: [
                {
                    id: 'g-tech',
                    klass: 'Technology',
                    meanStyle: leftStyle(pct(10)),
                    meanLabel: '$10M',
                    dots: [
                        { id: 'd-t1', style: leftStyle(pct(12)), value: '$12M', cls: 'imp-dot imp-dot_present' },
                        { id: 'd-t2', style: leftStyle(pct(8)), value: '$8M', cls: 'imp-dot imp-dot_present' },
                        { id: 'd-t3', style: leftStyle(pct(10)), value: 'filled', cls: 'imp-dot imp-dot_filled' },
                    ],
                },
                {
                    id: 'g-retail',
                    klass: 'Retail',
                    meanStyle: leftStyle(pct(2.5)),
                    meanLabel: '$2.5M',
                    dots: [
                        { id: 'd-r1', style: leftStyle(pct(3)), value: '$3M', cls: 'imp-dot imp-dot_present' },
                        { id: 'd-r2', style: leftStyle(pct(2)), value: '$2M', cls: 'imp-dot imp-dot_present' },
                        { id: 'd-r3', style: leftStyle(pct(2.5)), value: 'filled', cls: 'imp-dot imp-dot_filled' },
                    ],
                },
            ],
        };
    }
    get eImputationGroups() { return this.eImputationPlot.groups; }
    get eImputationAxis() { return this.eImputationPlot.axisLabels; }

    get rawDayEclair() {
        // Raw dates before grouping — sparse per-day counts across a week.
        const rows = [
            { id: 'rd1', label: 'Mon 04', value: 620, tone: 'secondary' },
            { id: 'rd2', label: 'Tue 05', value: 810, tone: 'secondary' },
            { id: 'rd3', label: 'Wed 06', value: 1120, tone: 'secondary' },
            { id: 'rd4', label: 'Thu 07', value: 740, tone: 'secondary' },
            { id: 'rd5', label: 'Fri 08', value: 990, tone: 'secondary' },
            { id: 'rd6', label: 'Sat 09', value: 350, tone: 'secondary' },
            { id: 'rd7', label: 'Sun 10', value: 280, tone: 'secondary' },
        ];
        return this._toEclairRows(rows, '');
    }

    get rawMonthEclair() {
        // Raw dates before month-grouping — same raw daily density as day view,
        // showing what the transformation is collapsing.
        return this.rawDayEclair;
    }

    get rawTextEclair() {
        // Raw text distribution — top verbatim strings by frequency.
        // Note: the blog notes this is a Zipf-like long tail; we show the head.
        const rows = [
            { id: 'rt1', label: '"missing item"', value: 142, tone: 'secondary' },
            { id: 'rt2', label: '"where is my order"', value: 118, tone: 'secondary' },
            { id: 'rt3', label: '"refund pls"', value: 96, tone: 'secondary' },
            { id: 'rt4', label: '"cant log in"', value: 74, tone: 'secondary' },
            { id: 'rt5', label: '"great service"', value: 62, tone: 'secondary' },
            { id: 'rt6', label: '"other"', value: 40, tone: 'secondary' },
        ];
        return this._toEclairRows(rows, '');
    }

    get replaceWithOptions() {
        return [
            { label: 'Average', value: 'average' },
            { label: 'Median', value: 'median' },
            { label: 'Mode', value: 'mode' },
            { label: 'Maximum', value: 'maximum' },
            { label: 'Minimum', value: 'minimum' },
        ];
    }

    get groupByOptions() {
        return [
            { label: 'Account Name', value: 'account-name' },
            { label: 'Industry', value: 'industry' },
            { label: 'Account Type', value: 'account-type' },
            { label: 'Billing Country', value: 'billing-country' },
        ];
    }

    get activeReplaceWith() {
        const id = this.effectiveActiveVariableId;
        if (!id) return 'average';
        return this.variableReplaceWith[id] || 'average';
    }

    get activeGroupBy() {
        const id = this.effectiveActiveVariableId;
        if (!id) return 'account-name';
        return this.variableGroupBy[id] || 'account-name';
    }

    get showReplaceMissingOptions() {
        return this.activeTransformation === 'replace-missing';
    }

    get showDistribution() {
        const v = this.activeVariable;
        return !!v && (v.type === 'number' || v.type === 'date');
    }

    get distributionMin() {
        const v = this.activeVariable;
        return v && v.min !== undefined ? v.min : '';
    }

    get distributionMax() {
        const v = this.activeVariable;
        return v && v.max !== undefined ? v.max : '';
    }

    get showPrevious() {
        return this.currentStep > 1;
    }

    get isNextDisabled() {
        if (this.currentStep === 1) {
            return !this.selectedDmo;
        }
        return false;
    }

    get showRightPanelContent() {
        return this.showRightPanel && !this.isAgentforceOpen;
    }

    get isAllRecordsSelected() {
        return this.filterSelection === 'all';
    }

    get isFilteredRecordsSelected() {
        return this.filterSelection === 'filtered';
    }


    get panelTitle() {
        if (this.currentStep === 5) return Labels.Panel5Title;
        if (this.currentStep === 4) return Labels.Panel4Title;
        if (this.currentStep === 3) return Labels.Panel3Title;
        if (this.currentStep === 2) return Labels.Panel2Title;
        return Labels.PanelTitle;
    }

    get panelHeadline() {
        if (this.currentStep === 5) return Labels.Panel5Headline;
        if (this.currentStep === 4) return Labels.Panel4Headline;
        if (this.currentStep === 3) return Labels.Panel3Headline;
        if (this.currentStep === 2) return Labels.Panel2Headline;
        return Labels.PanelHeadline;
    }

    get panelBody() {
        if (this.currentStep === 5) {
            return [
                { id: 'b1', text: Labels.Panel5Body1 },
                { id: 'b2', text: Labels.Panel5Body2 },
                { id: 'b3', text: Labels.Panel5Body3 },
                { id: 'b4', text: Labels.Panel5Body4 },
            ];
        }
        if (this.currentStep === 4) return [{ id: 'b1', text: Labels.Panel4Body1 }];
        if (this.currentStep === 3) return [{ id: 'b1', text: Labels.Panel3Body1 }];
        if (this.currentStep === 2) return [{ id: 'b1', text: Labels.Panel2Body1 }];
        return [
            { id: 'b1', text: Labels.PanelBody1 },
            { id: 'b2', text: Labels.PanelBody2 },
            { id: 'b3', text: Labels.PanelBody3 },
        ];
    }

    get panelCards() {
        if (this.currentStep === 5) return [];
        if (this.currentStep === 4) {
            return [
                { id: 'c1', title: Labels.Panel4Card1Title, articleId: 'choosing-an-algorithm' },
            ];
        }
        if (this.currentStep === 3) {
            return [
                { id: 'c1', title: Labels.Panel3Card1Title, articleId: 'which-variables-to-include' },
                { id: 'c2', title: Labels.Panel3Card2Title, articleId: 'choosing-variables-manually' },
                { id: 'c3', title: Labels.Panel3Card3Title, articleId: 'refine-variable-selection' },
            ];
        }
        if (this.currentStep === 2) {
            return [
                { id: 'c1', title: Labels.Panel2Card1Title, articleId: 'why-filtering-matters' },
                { id: 'c2', title: Labels.Panel2Card2Title, articleId: 'what-should-i-filter' },
            ];
        }
        return [
            { id: 'c1', title: Labels.Card1Title, articleId: 'clustering-vs-multiclass' },
            { id: 'c2', title: Labels.Card2Title, articleId: 'prepare-data-for-clustering' },
        ];
    }

    get dataSpaceOptions() {
        return [
            { label: 'AMER', value: 'AMER' },
            { label: 'default', value: 'default', description: 'Default data space where all the current DLOs are made members' },
        ];
    }

    get dataObjectTypeOptions() {
        return [
            { label: 'Data Model Object', value: 'dmo' },
            { label: 'Calculated Insights', value: 'calculated-insights' },
        ];
    }

    get filteredDmoItems() {
        const term = this.dmoSearchTerm.toLowerCase();
        return DATA_MODEL_OBJECTS.filter(
            (item) => !term || item.label.toLowerCase().includes(term) || item.apiName.toLowerCase().includes(term)
        );
    }

    get dmoSearchValue() {
        return this.selectedDmo ? `${this.selectedDmo.label} (${this.selectedDmo.apiName})` : this.dmoSearchTerm;
    }

    handleDmoSearchFocus() {
        this.showDmoDropdown = true;
    }

    handleDmoSearchInput(event) {
        this.dmoSearchTerm = event.target.value;
        this.selectedDmo = null;
        this.showDmoDropdown = true;
    }

    handleDmoSelect(event) {
        const id = event.currentTarget.dataset.id;
        this.selectedDmo = DATA_MODEL_OBJECTS.find((item) => item.id === id);
        this.dmoSearchTerm = '';
        this.showDmoDropdown = false;
    }

    handleDmoSearchBlur() {
        // Delay to allow click on list item
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            this.showDmoDropdown = false;
        }, 200);
    }

    handleSelectAllRecords() {
        this.filterSelection = 'all';
    }

    handleSelectFilteredRecords() {
        this.filterSelection = 'filtered';
    }

    handleVariableSearch(event) {
        this.variableSearchTerm = event.target.value;
    }

    handleToggleShowOnlySelected() {
        this.showOnlySelected = !this.showOnlySelected;
    }

    handleToggleAccountSection() {
        this.accountSectionOpen = !this.accountSectionOpen;
    }

    handleVariableToggle(event) {
        const id = event.currentTarget.dataset.id;
        const next = new Set(this.selectedVariableIds);
        if (next.has(id)) {
            next.delete(id);
            const actions = { ...this.variableActions };
            delete actions[id];
            this.variableActions = actions;
        } else {
            next.add(id);
        }
        this.selectedVariableIds = next;
    }

    handleRemoveVariable(event) {
        event.stopPropagation();
        const id = event.currentTarget.dataset.id;
        const next = new Set(this.selectedVariableIds);
        next.delete(id);
        this.selectedVariableIds = next;
        const actions = { ...this.variableActions };
        delete actions[id];
        this.variableActions = actions;
        const trans = { ...this.variableTransformations };
        delete trans[id];
        this.variableTransformations = trans;
        if (this.activeVariableId === id) {
            this.activeVariableId = null;
        }
    }

    handleVariableNameClick(event) {
        event.preventDefault();
        const id = event.currentTarget.dataset.id;
        this.activeVariableId = id;
        this.showRightPanel = true;
    }

    handleCloseVariablePanel() {
        if ((this.variantMode === 'b' || this.variantMode === 'b2' || this.variantMode === 'd' || this.variantMode === 'e' || this.variantMode === 'f' || this.variantMode === 'g') && this.currentStep === 3) return;
        this.activeVariableId = null;
    }

    handleVariantChange(event) {
        const mode = event.currentTarget.dataset.mode;
        if (!mode || mode === this.variantMode) return;
        this.variantMode = mode;
        this.variantPickerOpen = false;
        if (mode === 'b' || mode === 'b2' || mode === 'd' || mode === 'e') {
            if (!this.activeVariableId) {
                this.activeVariableId = ACCOUNT_VARIABLES[0].id;
            }
            this.showRightPanel = true;
        } else if (mode === 'c') {
            this.activeVariableId = null;
        }
    }

    handleToggleVariantPicker() {
        this.variantPickerOpen = !this.variantPickerOpen;
    }

    handleVariantPickerSearch(event) {
        this.variantPickerSearch = event.target.value;
    }

    handleVariantPickerSelect(event) {
        const id = event.currentTarget.dataset.id;
        if (!id) return;
        this.activeVariableId = id;
        this.variantPickerOpen = false;
        this.variantPickerSearch = '';
    }

    handleVariantRowExpand(event) {
        event.preventDefault();
        const id = event.currentTarget.dataset.id;
        if (!id) return;
        this.activeVariableId = this.activeVariableId === id ? null : id;
    }

    handleRowSettingsClick(event) {
        event.preventDefault();
        const id = event.currentTarget.dataset.id;
        if (!id) return;
        if (this.variantMode === 'c') {
            this.activeVariableId = this.activeVariableId === id ? null : id;
        } else {
            this.activeVariableId = id;
            this.showRightPanel = true;
        }
    }

    handleTransformationChange(event) {
        const id = this.effectiveActiveVariableId;
        if (!id) return;
        const value = event.detail.value;
        const trans = { ...this.variableTransformations };
        const actions = { ...this.variableActions };
        const next = new Set(this.selectedVariableIds);

        if (value === 'none') {
            delete trans[id];
            delete actions[id];
            next.delete(id);
        } else {
            trans[id] = value;
            if (value === 'replace-missing') actions[id] = Labels.TransformationReplaceMissing;
            else if (value === 'text-clustering') actions[id] = Labels.TransformationTextClustering;
            else if (value === 'group-by-month') actions[id] = Labels.TransformationGroupByMonth;
            else if (value === 'group-by-day') actions[id] = Labels.TransformationGroupByDay;
            next.add(id);
        }

        this.variableTransformations = trans;
        this.variableActions = actions;
        this.selectedVariableIds = next;
    }

    handleReplaceWithChange(event) {
        const id = this.effectiveActiveVariableId;
        if (!id) return;
        this.variableReplaceWith = { ...this.variableReplaceWith, [id]: event.detail.value };
    }

    handleGroupByChange(event) {
        const id = this.effectiveActiveVariableId;
        if (!id) return;
        this.variableGroupBy = { ...this.variableGroupBy, [id]: event.detail.value };
    }

    handleBucketChange(event) {
        const id = this.effectiveActiveVariableId;
        if (!id) return;
        this.variableBuckets = { ...this.variableBuckets, [id]: parseInt(event.target.value, 10) };
    }

    handleSelectKMeans() {
        this.selectedAlgorithm = 'kmeans';
    }

    handleSelectHdbscan() {
        this.selectedAlgorithm = 'hdbscan';
    }

    handleToggleAutoCluster(event) {
        this.autoClusterEnabled = event.target.checked;
    }

    handleClusterCountChange(event) {
        const val = parseInt(event.target.value, 10);
        if (!isNaN(val) && val >= 2 && val <= 10) {
            this.numberOfClusters = val;
        }
    }

    handleClusterDecrement() {
        if (this.numberOfClusters > 2) {
            this.numberOfClusters -= 1;
        }
    }

    handleClusterIncrement() {
        if (this.numberOfClusters < 10) {
            this.numberOfClusters += 1;
        }
    }

    handleModelNameChange(event) {
        this.modelName = event.target.value;
    }

    handleClusterDescriptionChange(event) {
        this.clusterDescription = event.target.value;
    }

    handleSaveTrain() {
        this.isTraining = true;
    }

    handleCancelTraining() {
        this.isTraining = false;
    }

    handleEditStep(event) {
        const step = parseInt(event.currentTarget.dataset.step, 10);
        if (step && step >= 1 && step <= 5) {
            this.currentStep = step;
        }
    }

    handleNext() {
        if (this.currentStep < 5) {
            this.currentStep += 1;
            this.activeArticleId = null;
        }
    }

    handlePrevious() {
        if (this.currentStep > 1) {
            this.currentStep -= 1;
            this.activeArticleId = null;
        }
    }

    handleStepClick(event) {
        const step = parseInt(event.currentTarget.dataset.step, 10);
        if (step && step >= 1 && step <= 5) {
            this.currentStep = step;
            this.activeArticleId = null;
        }
    }

    handleOpenArticle(event) {
        event.preventDefault();
        const articleId = event.currentTarget.dataset.article;
        if (articleId && Labels.ARTICLES[articleId]) {
            this.activeArticleId = articleId;
        }
    }

    handleCloseArticle() {
        this.activeArticleId = null;
    }

    get isArticleOpen() {
        return !!this.activeArticleId;
    }

    get activeArticle() {
        if (!this.activeArticleId) return null;
        const article = Labels.ARTICLES[this.activeArticleId];
        if (!article) return null;
        return {
            title: article.title,
            blocks: article.blocks.map((block, idx) => {
                const id = `blk-${idx}`;
                if (block.type === 'p') {
                    return { id, isParagraph: true, text: block.text };
                }
                if (block.type === 'h') {
                    return { id, isHeading: true, text: block.text };
                }
                if (block.type === 'ul') {
                    return {
                        id,
                        isUnorderedList: true,
                        items: block.items.map((it, i) => ({
                            id: `${id}-i${i}`,
                            strong: it.strong || '',
                            hasStrong: !!it.strong,
                            text: it.text,
                        })),
                    };
                }
                if (block.type === 'ol') {
                    return {
                        id,
                        isOrderedList: true,
                        items: block.items.map((it, i) => ({
                            id: `${id}-i${i}`,
                            strong: it.strong || '',
                            hasStrong: !!it.strong,
                            text: it.text,
                        })),
                    };
                }
                return { id, isParagraph: true, text: '' };
            }),
        };
    }

    handleToggleLeft() {
        this.showLeftPanel = !this.showLeftPanel;
    }

    handleToggleRight() {
        this.showRightPanel = !this.showRightPanel;
    }

    async handleViewData() {
        await DataViewerModal.open({ size: 'large' });
    }

    handleBack() {
        navigate('/app/aim-cluster');
    }

    handleToggleAgentforce() {
        this.isAgentforceOpen = !this.isAgentforceOpen;
    }

    handleCloseAgentforce() {
        this.isAgentforceOpen = false;
    }
}
