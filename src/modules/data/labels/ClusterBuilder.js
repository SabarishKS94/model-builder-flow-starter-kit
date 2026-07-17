export const BuilderType = 'Cluster Builder';
export const ModelName = 'Fiscal Calendar WavePM Cluster Model Version 1';
export const NextButton = 'Next';
export const PreviousButton = 'Previous';
export const Step1 = 'Select Data';
export const Step2 = 'Filter Data';
export const Step3 = 'Prepare Variables';
export const Step4 = 'Define Settings';
export const Step5 = 'Review & Save';
export const SelectDataTitle = 'Select Your Data';
export const DataSpaceLabel = 'Data Space';
export const DataSpacePlaceholder = 'AMER';
export const DataLabel = 'What data would you like to use?';
export const DataObjectType = 'Data Model Object';
export const DataSearchPlaceholder = 'Search data model objects...';
export const ViewDataButton = 'View Data';
export const PanelTitle = 'Create a Clustering Model';
export const PanelHeadline = "What's Clustering useful for?";
export const PanelBody1 = "Clustering identifies hidden patterns and segments in your records that simple filters can't reveal. Use these models instead of fixed-category models, such as multiclass models, when categories are unknown or changing.";
export const PanelBody2 = 'They are ideal when classes are unknown, fuzzy, or changing (unlike fixed-category multiclass models).';
export const PanelBody3 = 'Key industry-agnostic use cases include: Customer Segmentation for targeted marketing. Product Segmentation for optimizing inventory, pricing, and promotions.';
export const Card1Title = 'Difference between Clustering and Multiclass';
export const Card2Title = 'How can I prepare data for clustering?';
export const ShowMore = 'Show Me More';
export const ArticleBackLabel = 'Back';

// Step 2 - Filter Data
export const FilterDataTitle = 'Filter the data used to train the model';
export const Panel2Title = 'Create a Clustering Model';
export const Panel2Headline = 'Filter Data';
export const Panel2Body1 = 'Filtering helps you decide which portion of your data should be included for clustering. A clean, focused slice of data leads to clearer segments and avoids noise that can distort the results.';
export const Panel2Card1Title = 'Why filtering matters';
export const Panel2Card2Title = 'What should I filter?';

// Step 3 - Prepare Variables
export const PrepareVariablesTitleBold = 'Prepare variables';
export const PrepareVariablesTitleRest = 'for clustering';
export const ShowOnlySelected = 'Show only selected';
export const VariableSearchPlaceholder = 'Search variables...';
export const VariableColumn = 'Variable';
export const TransformationColumn = 'Transformation';
export const SettingsColumn = 'Settings';
export const ReplaceMissingValues = 'Replace Missing Values';
export const TextClustering = 'Text Clustering';
export const Panel3Title = 'Create a Clustering Model';
export const Panel3Headline = 'Prepare Variables';
export const Panel3Body1 = 'Preparing your variables can help your model interpret better.';
export const Panel3Card1Title = 'Which variables should I include in the clustering?';
export const Panel3Card2Title = 'Choosing variables manually';
export const Panel3Card3Title = 'Can I refine my variable selection?';

// Variable Settings Panel
export const AlertsTab = 'Alerts';
export const SettingsTab = 'Settings';
export const TransformationLabel = 'Transformation';
export const TransformationNone = 'None';
export const TransformationReplaceMissing = 'Replace Missing Values';
export const TransformationTextClustering = 'Text Clustering';
export const TransformationGroupByMonth = 'Group by Month';
export const TransformationGroupByDay = 'Group by Day';
export const ReplaceWithLabel = 'Replace With';
export const GroupByLabel = 'Group By';
export const NumberOfBucketsLabel = 'Number of Buckets';
export const BucketRangeLabel = '10-100';
export const DistributionLabel = 'Distribution';
export const MinValueLabel = 'Minimum Value:';
export const MaxValueLabel = 'Maximum Value:';
export const CountAxisLabel = 'Count';

// B2 — Guided panel copy (upfront explanation replaces info icons)
// [draft — verify]
export const B2StandardSectionTitle = 'Standard settings';
export const B2StandardSectionSubtitle = 'Applies to every variable before training.';
export const B2TransformSectionTitle = 'Transformation settings';
export const B2TransformSectionSubtitle = 'Specific to how this variable is prepared.';

export const B2TransformIntroTitle = 'What is a transformation?';
export const B2TransformIntroWhat = 'A transformation reshapes raw values into a form the clustering model can compare against other variables.';
export const B2TransformIntroWhen = 'Use one whenever the raw values are noisy, sparse, or too granular — for example dates down to the second, or numeric columns with missing rows.';
export const B2TransformIntroWhy = 'Well-transformed inputs let the model find cleaner, more stable clusters and reduce distortion from a few extreme rows.';
export const B2TransformIntroOutcome = 'You will see the variable represented as short categories, filled-in numbers, or day/month buckets — whichever fits its type.';
export const B2TransformIntroRisk = 'If you skip this, missing rows may drop out of training and high-cardinality text or timestamp fields can dominate the model without adding meaning.';

export const B2LabelWhatPrefix = 'What:';
export const B2LabelWhyPrefix = 'Why:';
export const B2LabelRiskPrefix = 'Risk if skipped:';

// Per-setting hints
export const B2TransformationWhat = 'Pick how the raw values are prepared for this variable.';
export const B2TransformationWhy = 'The right transformation makes this variable comparable to the rest of the training set.';
export const B2TransformationRisk = 'Leaving this as None keeps the raw values, which may push this variable out of training if the field is sparse or high-cardinality.';

export const B2ReplaceWithWhat = 'Choose the value that fills in rows where this field is empty.';
export const B2ReplaceWithWhy = 'Every training row needs a value — average or median tend to be safest for numeric fields with a normal spread.';
export const B2ReplaceWithRisk = 'Rows with a missing value here will be dropped from training, shrinking your dataset without warning.';

export const B2GroupByLabel = 'Group by categories';
export const B2GroupByWhat = 'Pick the categories used to compute the fill-in value per group.';
export const B2GroupByWhy = 'Grouping keeps the fill-in relevant — e.g. average revenue is more accurate per industry than across the whole table.';
export const B2GroupByRisk = 'Without categories, one global average is used for every row, which can wash out real differences between segments.';

export const B2BucketsWhat = 'Choose how many equal-width bins the numeric range is split into.';
export const B2BucketsWhy = 'Bucketing turns a continuous number into a small set of comparable groups the model can cluster against.';
export const B2BucketsRisk = 'Too few buckets flattens real differences; too many creates near-empty groups that add noise.';

// Sample outcome previews (per transformation)
export const B2SamplePreviewTitle = 'Sample outcome';
export const B2SamplePreviewCaption = 'How the model will see this variable after training.';

export const B2SampleReplaceBeforeLabel = 'Before';
export const B2SampleReplaceAfterLabel = 'After';
export const B2SampleReplaceBeforeCaption = '18% of rows missing a value';
export const B2SampleReplaceAfterCaption = 'Filled with average per industry';

export const B2SampleDayLabel = 'Day buckets';
export const B2SampleDayCaption = '4,400+ dates collapsed into ~2,900 day buckets.';

export const B2SampleMonthLabel = 'Month buckets';
export const B2SampleMonthCaption = '4,400+ dates collapsed into 148 month buckets.';

export const B2SampleTextLabel = 'Category clusters';
export const B2SampleTextCaption = 'Free text collapsed into a small set of categories.';

// Variant D — Guided (numbered steps + risk banner + sample outcome)
// [draft — verify]
export const DPanelIntroEyebrow = 'Preparing this variable';
export const DPanelIntroTitle = "Turn this variable into something the model can read";
export const DPanelIntroBody = 'Raw values like timestamps, free text, or fields with gaps are hard for a clustering model to compare. Two quick decisions below reshape this variable into a clean input.';

export const DStep1Title = '1 · Pick a transformation';
export const DStep1Sub = 'Chooses how this variable is reshaped before training.';
export const DStep1What = 'Sets the recipe used to prepare this variable — filling gaps, grouping dates, or collapsing free text.';
export const DStep1Risk = 'If you leave this as None, sparse or high-cardinality fields can dominate the model without adding meaning.';

export const DStep2Title = '2 · Fine-tune the recipe';
export const DStep2Sub = 'Only shows the extra choices your transformation needs.';

export const DReplaceWithLabelD = 'Fill missing values with';
export const DReplaceWithWhat = 'The value the model will use whenever this field is empty. Average is a safe default for most numeric fields.';
export const DReplaceWithRisk = 'Empty rows get dropped from training if you skip this — your training set shrinks silently.';

export const DGroupByLabelD = 'Compute the fill-in per category';
export const DGroupByWhat = 'Use categories (like industry or region) so the fill-in reflects the group each row belongs to, not just a global average.';
export const DGroupByRisk = 'A single global fill-in can wash out real differences between segments.';

export const DBucketsLabelD = 'Split into buckets';
export const DBucketsWhat = 'The number of equal-width bins the numeric range is split into. Around 10-20 works for most business metrics.';
export const DBucketsRisk = 'Too few buckets flattens real patterns; too many creates near-empty groups that add noise.';

export const DStep3Title = '3 · Preview the outcome';
export const DStep3Sub = 'What the model will see for this variable after training.';

export const DRiskBannerTitle = 'Skipping this?';
export const DRiskBannerBody = 'Leaving this variable un-transformed is fine only when the raw values are already clean, dense, and low-cardinality. Otherwise, the model may ignore it or over-weight it.';

// Step 4 - Define Settings
export const DefineSettingsTitleBold = 'Select an Algorithm';
export const DefineSettingsTitleRest = 'for Your Model';
export const KMeansTitle = 'KMeans';
export const KMeansDesc = 'Use when you need to sort clean, well-structured data into a specific number of groupings.';
export const HDBScanTitle = 'HDBSCAN';
export const HDBScanDesc = "Use when you don't know the number of clusters and your data has noise or outliers.";
export const ClusterSettingsTitle = 'Cluster Settings';
export const AutoClusterToggleLabel = 'Let the model determine the optimal number of clusters.';
export const AutoClusterEnabled = 'Enabled';
export const AutoClusterDisabled = 'Disabled';
export const NumberOfClustersLabel = 'Number of clusters (2-10)';
export const Panel4Title = 'Create a Clustering Model';
export const Panel4Headline = 'Define Settings';
export const Panel4Body1 = 'This is where you choose how the clustering is done. You can select an algorithm manually or let Autopilot run both options and pick the best results. The right algorithm depends on your data and the type of segments you want. Use K-Means if you have an idea of how many clusters you want. Use HDBSCAN for exploratory segmentation or uneven data';
export const Panel4Card1Title = 'Choosing an algorithm';
export const Panel4Card2Title = 'Finding the right data model object';
export const Panel4Card3Title = 'Using additional data model objects';

// Step 5 - Review & Save
export const ReviewTitle = 'Review your model and train it.';
export const ModelNameLabel = 'Model Name';
export const ModelNameValue = 'Customer Segmentation Cluster model';
export const ClusterDescriptionLabel = 'Cluster Description';
export const ClusterDescriptionValue = 'Segmenting customers based on RFM';
export const VersionLabel = 'Version';
export const VersionValue = '1';
export const AgentforceTitle = 'Agentforce';
export const AgentforceGreeting = "Let's chat!";
export const AgentforceError = 'Something went wrong. Refresh and try again.';
export const AgentforceRefresh = 'Refresh';
export const AgentforceInputPlaceholder = 'Describe your task or ask a question…';
export const ReviewDataTitle = '1. Data';
export const ReviewFiltersTitle = '2. Filters';
export const ReviewVariablesTitle = '3. Variables';
export const ReviewSettingsTitle = '4. Settings';
export const ReviewDataSpaceLabel = 'Data Space:';
export const ReviewDataSpaceValue = 'AMER';
export const ReviewDmoLabel = 'Data Model Object:';
export const ReviewDmoValue = 'Account';
export const ReviewFilterRecords = '504 of 1000000 records will be used to train the model';
export const ReviewFiltersInfo = '2 Filters and 348 records excluded';
export const ReviewVariablesInfo = '5 of 7 variables selected';
export const ReviewAlgorithmLabel = 'Algorithm:';
export const ReviewAlgorithmValueKMeans = 'Kmeans';
export const ReviewAlgorithmValueHDBScan = 'HDBSCAN';
export const SaveTrainButton = 'Save & Train';
export const BackButton = 'Back';
export const CancelButton = 'Cancel';
export const TrainingVersionLabel = 'Version 1 (Training)';
export const TrainingLastUpdatedLabel = 'Last Updated Jun 15, 2026, 01:49 PM';
export const TrainingSpinnerTitle = 'Finding clusters...';
export const TrainingSpinnerBody = 'Training can take up to 24 hours. Version 1 cannot be edited until training is complete. Check back later.';
export const Panel5Title = 'Create a Clustering Model';
export const Panel5Headline = 'What happens next';
export const Panel5Body1 = 'Make sure all filters, variables, and algorithm settings are correct before saving.';
export const Panel5Body2 = 'Once the model is trained, you can explore the Cluster Summary to understand each group';
export const Panel5Body3 = 'Use the Training Metrics tab to see the quality of clusters, understand top contributing features and if the clusters are good enough for the model to be activated';
export const Panel5Body4 = 'For ongoing segmentation, use flows, batch data transforms, prediction jobs, and APIs to map new or live data to saved clusters.';

// Right-panel article content (drill-down when a link is clicked)
export const ARTICLES = {
    'clustering-vs-multiclass': {
        title: 'Difference between Clustering and Multiclass',
        blocks: [
            { type: 'p', text: "Clustering is an unsupervised technique that groups similar records and separates different ones based on natural patterns. Because it doesn't rely on predefined labels to predict specific outcomes, it is highly flexible." },
        ],
    },
    'prepare-data-for-clustering': {
        title: 'How can I prepare data for clustering?',
        blocks: [
            { type: 'p', text: 'To form meaningful, distinct clusters that provide actionable insights, include a balanced mix of two variable types.' },
            { type: 'ul', items: [
                { strong: 'Entity Attributes:', text: ' Descriptive details that define the records, such as type, industry, or region.' },
                { strong: 'Behavioral Variables:', text: ' Metrics that reflect how entities behave, such as interactions, usage patterns, or transactions.' },
            ] },
        ],
    },
    'why-filtering-matters': {
        title: 'Why filtering matters',
        blocks: [
            { type: 'ul', items: [
                { text: 'Keeps the clustering focused on a relevant population' },
                { text: 'Helps remove outliers or rare edge cases, older historical data that may not have relevance now' },
                { text: 'Improves model stability and interpretability' },
            ] },
        ],
    },
    'what-should-i-filter': {
        title: 'What should I filter?',
        blocks: [
            { type: 'p', text: 'Filter data for consistent, meaningful clustering:' },
            { type: 'ol', items: [
                { strong: 'Exclude incomplete/unusable records:', text: ' Remove rows with missing key fields or entities with limited/no meaningful signal.' },
                { strong: 'Narrow the population:', text: ' Include only the target group (e.g., active customers, specific product categories, stores in a given market).' },
                { strong: 'Remove known outliers:', text: ' Exclude extremely large/small values or irregular entities whose behavior is not representative.' },
            ] },
        ],
    },
    'which-variables-to-include': {
        title: 'Which variables should I include in the clustering?',
        blocks: [
            { type: 'p', text: 'Select variables that capture meaningful differences between records to identify patterns and group similar items:' },
            { type: 'ul', items: [
                { text: 'Include a mix of numeric, categorical, and behavioral variables relevant to your business goal, such as customer demographics, purchase behavior, or engagement metrics.' },
                { text: 'Avoid IDs, system-generated keys, or constant fields.' },
            ] },
        ],
    },
    'choosing-variables-manually': {
        title: 'Choosing variables manually',
        blocks: [
            { type: 'p', text: 'Manually selecting variables gives you control over how clusters are formed and what patterns the model prioritizes. By choosing the right combination of variables, you can ensure the clusters reflect meaningful differences in your data and align with your business goals.' },
            { type: 'ul', items: [
                { text: 'Include descriptive variables, such as profile attributes or lifecycle stages, to define the record. Also include behavioral variables, such as engagement metrics or usage patterns, to capture activity over time.' },
                { text: "Avoid redundant or highly correlated variables so they don't overemphasize patterns and skew results. Exclude noisy, sparsely populated, or irrelevant variables to maintain cluster quality." },
            ] },
        ],
    },
    'refine-variable-selection': {
        title: 'Can I refine my variable selection?',
        blocks: [
            { type: 'p', text: 'Refine variables iteratively to improve cluster quality, interpretability, and analysis usefulness:' },
            { type: 'ul', items: [
                { text: 'Start with a set of variables, run cluster models, and review the results.' },
                { text: 'Remove variables that lack meaningful differences.' },
                { text: 'Add variables to improve separation, or test alternative combinations.' },
            ] },
        ],
    },
    'choosing-an-algorithm': {
        title: 'Choosing an algorithm',
        blocks: [
            { type: 'h', text: 'K-Means' },
            { type: 'ul', items: [
                { text: 'You define the number of clusters the algorithm has to create.' },
                { text: 'Works best when the clusters in your data are similar in both size and shape.' },
                { text: 'When clusters are distinct and clearly separated, K-Means produces highly accurate and interpretable results.' },
            ] },
            { type: 'h', text: 'HDBSCAN' },
            { type: 'ul', items: [
                { text: 'Automatically detects the number of clusters in your data.' },
                { text: 'Works best on complex data with clusters of varying shapes, densities, or sizes.' },
                { text: 'The algorithm groups points based on density, identifying dense regions as clusters while marking sparse points as noise or outliers.' },
            ] },
        ],
    },
};
