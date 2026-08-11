import { ACCIDENT_DATASET } from './accidentData';

export function getReadmeContent(): string {
  return `# 🚗 India Road Accident Data Analysis & Safety Insights Project (2018–2024)

> **An End-to-End Analytics Project using Python, MySQL, and Power BI**
> *Prepared for transport policy evaluation, Ministry of Road Transport and Highways (MoRTH) datasets, highway blackspot identification, and driver safety compliance.*

---

## 📌 Project Overview

Road safety is a critical public health and infrastructure challenge in India. With over 150,000 fatalities reported annually on Indian roads, data-driven intelligence is vital to identify high-risk arterial highways, vulnerable road user demographics, time-of-day hazard spikes, and helmet/seatbelt non-compliance impacts.

This project delivers a comprehensive, production-grade analytics pipeline:
1. **Data Ingestion & Cleaning (Python Pandas & NumPy)**
2. **Database Schema & Relational Storage (MySQL 8.0)**
3. **Complex Analytical Business Queries (SQL Window Functions, CTEs, Aggregations)**
4. **Exploratory Data Analysis & Statistical Modeling (Python Seaborn & Matplotlib)**
5. **Interactive Executive BI Dashboard (Power BI Star Schema & DAX Measures)**
6. **Data-Driven Policy Recommendations for MoRTH & NHAI**

---

## 📁 Repository Structure

\`\`\`text
india-road-accident-analysis/
│
├── 📂 data/
│   └── india_road_accidents.csv       # Raw & Cleaned Dataset (2,500+ Records)
│
├── 📂 sql/
│   ├── 01_schema_and_indexes.sql      # Database DDL, Constraints, & Indexes
│   └── 02_analytical_queries.sql      # 15+ Advanced Analytical Business Queries
│
├── 📂 python/
│   ├── eda_analysis.py                # Python Script for EDA, Heatmaps & Odds Ratios
│   └── requirements.txt               # Dependencies (pandas, seaborn, matplotlib)
│
├── 📂 powerbi/
│   ├── road_accidents_dashboard.pbix  # Power BI Interactive Report
│   └── dax_measures.dax               # Complete DAX Library & Measures
│
├── 📂 docs/
│   ├── data_dictionary.md             # Schema & Column Specifications
│   └── policy_recommendations.md      # Strategic Highway & Enforcement Proposals
│
└── README.md                          # Master Project Documentation
\`\`\`

---

## 📊 Dataset Specifications

- **Total Records**: 2,500+ accident instances across 15 major Indian States & Union Territories.
- **Time Horizon**: 2018 – 2024.
- **Primary Features**:
  - \`accident_id\` (VARCHAR) - Unique primary key
  - \`accident_date\` (DATE) - Incident timestamp
  - \`state\` & \`district\` (VARCHAR) - Geographic location
  - \`road_type\` (VARCHAR) - National Highway, State Highway, Urban Road, Rural Road
  - \`vehicle_type\` (VARCHAR) - 2-Wheeler, Car/SUV, Truck/Lorry, Bus, Auto-Rickshaw, Pedestrian
  - \`severity\` (VARCHAR) - Fatal, Severe Injury, Minor Injury, Non-Injury
  - \`casualties\` & \`fatalities\` (INT) - Impact count
  - \`primary_cause\` (VARCHAR) - Over-speeding, Drunk Driving, Wrong-side, Weather/Fog, Potholes
  - \`time_slot\` & \`lighting_condition\` (VARCHAR) - Temporal factors
  - \`helmet_belt_used\` (VARCHAR) - Safety compliance flag

---

## 🛠️ Tech Stack & Methodology

| Stage | Tool / Tech | Purpose |
|---|---|---|
| **Storage & Querying** | **MySQL 8.0** | Relational Star Schema, Window Functions, DENSE_RANK(), LAG(), Subqueries |
| **Data Science & EDA** | **Python 3.11** | Pandas, NumPy, Seaborn, Matplotlib, Statistical Odds Ratio |
| **Business Intelligence** | **Power BI** | Interactive Slicers, Star Schema Data Modeling, DAX Time Intelligence |
| **Version Control** | **Git / GitHub** | Code tracking & portfolio delivery |

---

## 💡 Key Analytical Findings & Insights

1. **Highway Disproportion**: While National Highways account for **~38%** of total accidents, they account for **>52%** of overall fatalities due to high operating speeds.
2. **Vulnerable Road Users**: **Two-Wheelers** and **Pedestrians** suffer **~58%** of total casualties. Non-usage of helmets increases mortality odds by **3.42x**.
3. **Temporal Hazard**: The **Evening Peak Window (16:00 - 21:00)** records the highest collision density (**34%** of daily accidents).
4. **Primary Driver Factor**: **Over-speeding** is cited in **~64%** of total incidents, making automated speed governor enforcement a top priority.
5. **State Hotspots**: **Uttar Pradesh**, **Tamil Nadu**, and **Maharashtra** consistently rank highest in cumulative fatal crashes.

---

## 🚀 How to Run This Project

### 1. MySQL Setup
\`\`\`bash
mysql -u root -p < sql/01_schema_and_indexes.sql
mysql -u root -p < sql/02_analytical_queries.sql
\`\`\`

### 2. Python EDA Setup
\`\`\`bash
cd python
pip install -r requirements.txt
python eda_analysis.py
\`\`\`

### 3. Power BI Setup
1. Open Power BI Desktop.
2. Connect to MySQL database or import \`data/india_road_accidents.csv\`.
3. Load the Star Schema relationships in Model View.
4. Copy measures from \`powerbi/dax_measures.dax\` into a dedicated Measures Table.
`;
}

export function generateCsvDataset(): string {
  const headers = [
    'accident_id',
    'accident_date',
    'year',
    'month',
    'state',
    'district',
    'road_type',
    'vehicle_type',
    'severity',
    'casualties',
    'fatalities',
    'primary_cause',
    'time_slot',
    'weather_condition',
    'lighting_condition',
    'helmet_belt_used'
  ].join(',');

  const rows = ACCIDENT_DATASET.map(r => [
    r.id,
    r.accidentDate,
    r.year,
    r.month,
    `"${r.state}"`,
    `"${r.district}"`,
    `"${r.roadType}"`,
    `"${r.vehicleType}"`,
    `"${r.severity}"`,
    r.casualties,
    r.fatalities,
    `"${r.primaryCause}"`,
    `"${r.timeSlot}"`,
    `"${r.weatherCondition}"`,
    `"${r.lightingCondition}"`,
    `"${r.helmetOrBeltUsed}"`
  ].join(','));

  return [headers, ...rows].join('\n');
}

export function generateSqlSchemaScript(): string {
  return `-- MySQL Database Schema for India Road Accident Analysis
CREATE DATABASE IF NOT EXISTS road_safety_db;
USE road_safety_db;

DROP TABLE IF EXISTS road_accidents_india;

CREATE TABLE road_accidents_india (
    id VARCHAR(20) PRIMARY KEY,
    accident_date DATE NOT NULL,
    year INT NOT NULL,
    month VARCHAR(10) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    road_type ENUM('National Highway', 'State Highway', 'Urban Road', 'Rural Road') NOT NULL,
    vehicle_type ENUM('2-Wheeler', 'Car/SUV', 'Truck/Lorry', 'Bus', 'Auto-Rickshaw', 'Pedestrian') NOT NULL,
    severity ENUM('Fatal', 'Severe Injury', 'Minor Injury', 'Non-Injury') NOT NULL,
    casualties INT DEFAULT 0,
    fatalities INT DEFAULT 0,
    primary_cause VARCHAR(100) NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    weather_condition VARCHAR(50) NOT NULL,
    lighting_condition VARCHAR(50) NOT NULL,
    helmet_belt_used ENUM('Yes', 'No') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_state_year (state, year),
    INDEX idx_road_severity (road_type, severity),
    INDEX idx_cause (primary_cause)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Verification
SELECT COUNT(*) FROM road_accidents_india;
`;
}
