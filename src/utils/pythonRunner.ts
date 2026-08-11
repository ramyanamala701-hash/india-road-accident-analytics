import { PythonCodeCell } from '../types';

export const CURATED_PYTHON_CELLS: PythonCodeCell[] = [
  {
    id: 'cell-1',
    title: '1. Environment Setup & Data Loading',
    type: 'imports',
    code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Set aesthetics for MoRTH Publication Quality Visuals
sns.set_theme(style="whitegrid", palette="muted")
plt.rcParams['font.sans-serif'] = 'Helvetica'
plt.rcParams['axes.edgecolor'] = '#cccccc'

# Load Indian Road Accident Dataset
df = pd.read_csv('india_road_accidents.csv')
print("Dataset Shape:", df.shape)
df.head(5)`,
    outputSummary: 'Dataset loaded successfully with 2,500 records and 16 features.',
    insight: 'The dataset encompasses structured columns: accidentDate, state, district, roadType, vehicleType, severity, casualties, fatalities, primaryCause, timeSlot, weatherCondition, lightingCondition, and helmetOrBeltUsed.'
  },
  {
    id: 'cell-2',
    title: '2. Data Audit & Null Value Check',
    type: 'missing',
    code: `# Data Types and Null Value Count
print(df.info())
print("\n--- Missing Value Count ---")
print(df.isnull().sum())

# Categorical Value Distribution
print("\n--- Unique Road Types ---")
print(df['roadType'].value_counts(normalize=True) * 100)`,
    outputSummary: '0 missing values across all columns. 100% data completeness.',
    insight: 'Road Type Distribution: National Highways (~38.4%), Urban Roads (~28.2%), State Highways (~22.1%), Rural Roads (~11.3%).'
  },
  {
    id: 'cell-3',
    title: '3. Fatality Rate & Casualty Boxplot Analysis',
    type: 'distribution',
    code: `fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# 1. Casualty Boxplot by Vehicle Type
sns.boxplot(data=df, x='vehicleType', y='casualties', ax=axes[0], palette='crest')
axes[0].set_title('Casualty Distribution per Incident by Vehicle Type')
axes[0].set_ylabel('Number of Casualties')

# 2. Fatality Rate by Road Type
fatality_by_road = df.groupby('roadType')['fatalities'].mean().reset_index()
sns.barplot(data=fatality_by_road, x='roadType', y='fatalities', ax=axes[1], palette='rocket')
axes[1].set_title('Average Fatalities per Incident by Road Category')
axes[1].set_ylabel('Mean Fatalities')

plt.tight_layout()
plt.show()`,
    outputSummary: 'Generated 2-panel Seaborn plot comparing casualty spread and mean fatalities.',
    insight: 'National Highways record a mean fatality rate of 0.62 per crash—nearly 2.8x higher than Urban Arterial Roads (0.22)—driven by high operating velocities.'
  },
  {
    id: 'cell-4',
    title: '4. Heatmap: Incident Density by Time Slot & Primary Cause',
    type: 'correlation',
    code: `# Pivot table of Primary Cause vs Time Slot
pivot_cause_time = pd.crosstab(df['primaryCause'], df['timeSlot'], values=df['fatalities'], aggfunc='sum')

plt.figure(figsize=(10, 6))
sns.heatmap(pivot_cause_time, annot=True, fmt='d', cmap='YlOrRd', cbar=True)
plt.title('Fatality Heatmap: Primary Cause vs Time of Day')
plt.xlabel('Time Slot')
plt.ylabel('Primary Cause')
plt.tight_layout()
plt.show()`,
    outputSummary: 'Generates 2D cross-tabulation heatmap.',
    insight: 'Over-speeding during Evening Peak Hours (16:00 - 21:00) accounts for the largest absolute cluster of highway deaths (340+ fatalities in sample).'
  },
  {
    id: 'cell-5',
    title: '5. Statistical Odds Ratio: Non-Helmet Usage Risk',
    type: 'geo_risk',
    code: `# Calculate Mortality Odds Ratio for 2-Wheeler riders without Helmet
tw_df = df[df['vehicleType'] == '2-Wheeler']
contingency_tbl = pd.crosstab(tw_df['helmetOrBeltUsed'], tw_df['severity'] == 'Fatal')

fatality_no_helmet = contingency_tbl.loc['No', True] / contingency_tbl.loc['No'].sum()
fatality_with_helmet = contingency_tbl.loc['Yes', True] / contingency_tbl.loc['Yes'].sum()

odds_ratio = (fatality_no_helmet / (1 - fatality_no_helmet)) / (fatality_with_helmet / (1 - fatality_with_helmet))
print(f"2-Wheeler Non-Helmet Mortality Odds Ratio: {odds_ratio:.2f}")`,
    outputSummary: 'Mortality Odds Ratio calculated: 3.42',
    insight: 'Two-wheeler riders not wearing helmets face a 3.42x higher odds of sustaining fatal head injuries during impact compared to helmet-compliant riders.'
  }
];
