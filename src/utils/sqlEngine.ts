import { AccidentRecord, SqlQueryItem } from '../types';

export const CURATED_SQL_QUERIES: SqlQueryItem[] = [
  {
    id: 'q1',
    title: 'Executive Summary KPI Aggregation',
    category: 'Basic Aggregations',
    description: 'Calculates overall counts of accidents, total casualties, fatalities, and severe injury percentages.',
    sql: `SELECT 
    COUNT(id) AS Total_Accidents,
    SUM(fatalities) AS Total_Fatalities,
    SUM(casualties) AS Total_Casualties,
    ROUND((SUM(fatalities) / COUNT(id)) * 100, 2) AS Fatality_Rate_Pct,
    ROUND((COUNT(CASE WHEN severity = 'Severe Injury' THEN 1 END) / COUNT(id)) * 100, 2) AS Severe_Injury_Pct
FROM road_accidents_india;`,
    explanation: 'Uses aggregate functions SUM() and COUNT() with CASE WHEN conditional expressions to build top-level executive metrics for MoRTH dashboards.'
  },
  {
    id: 'q2',
    title: 'State-wise Fatality Ranking with Window Functions',
    category: 'Window Functions & Ranking',
    description: 'Ranks Indian States based on total fatalities using DENSE_RANK() and computes cumulative percentage contribution.',
    sql: `SELECT 
    state,
    COUNT(id) AS Total_Accidents,
    SUM(fatalities) AS Total_Fatalities,
    ROUND(AVG(fatalities), 2) AS Avg_Fatalities_Per_Accident,
    DENSE_RANK() OVER (ORDER BY SUM(fatalities) DESC) AS State_Fatality_Rank
FROM road_accidents_india
GROUP BY state
ORDER BY State_Fatality_Rank ASC
LIMIT 10;`,
    explanation: 'Employs DENSE_RANK() window function to identify top priority states requiring urgent road safety enforcement and highway patrol deployment.'
  },
  {
    id: 'q3',
    title: 'Highway Hazard Index (National vs State vs Urban Roads)',
    category: 'Factor Analysis',
    description: 'Compares casualty severity and fatality concentration across National Highways, State Highways, and Urban arterial roads.',
    sql: `SELECT 
    road_type,
    COUNT(id) AS Accident_Count,
    SUM(fatalities) AS Total_Fatalities,
    ROUND((SUM(fatalities) / SUM(casualties)) * 100, 2) AS Casualty_Fatality_Ratio_Pct,
    ROUND(AVG(casualties), 2) AS Avg_Casualties_Per_Incident
FROM road_accidents_india
GROUP BY road_type
ORDER BY Total_Fatalities DESC;`,
    explanation: 'Analyzes why National Highways account for higher fatality proportions despite lower overall traffic frequency compared to city roads.'
  },
  {
    id: 'q4',
    title: 'Compliance Impact: Helmet & Seatbelt Usage vs Mortality',
    category: 'Safety & Compliance',
    description: 'Measures mortality rates when safety gear (Helmets/Seatbelts) was neglected vs properly worn.',
    sql: `SELECT 
    vehicle_type,
    helmet_belt_used,
    COUNT(id) AS Total_Incidents,
    SUM(fatalities) AS Fatalities,
    ROUND((SUM(fatalities) / COUNT(id)) * 100, 2) AS Incident_Fatality_Rate_Pct
FROM road_accidents_india
WHERE vehicle_type IN ('2-Wheeler', 'Car/SUV')
GROUP BY vehicle_type, helmet_belt_used
ORDER BY vehicle_type, helmet_belt_used DESC;`,
    explanation: 'Provides empirical evidence showing that non-usage of helmets/seatbelts increases mortality risk per crash by over 3x.'
  },
  {
    id: 'q5',
    title: 'Month-over-Month (MoM) Trend & Growth using LAG()',
    category: 'Time Series & Growth',
    description: 'Calculates MoM percentage change in road accidents using SQL window function LAG().',
    sql: `WITH Monthly_Accidents AS (
    SELECT 
        year,
        month,
        COUNT(id) AS Monthly_Count,
        SUM(fatalities) AS Monthly_Fatalities
    FROM road_accidents_india
    GROUP BY year, month
)
SELECT 
    year,
    month,
    Monthly_Count,
    LAG(Monthly_Count, 1) OVER (ORDER BY year, month) AS Previous_Month_Count,
    ROUND(
        ((Monthly_Count - LAG(Monthly_Count, 1) OVER (ORDER BY year, month)) / 
        NULLIF(LAG(Monthly_Count, 1) OVER (ORDER BY year, month), 0)) * 100, 
        2
    ) AS MoM_Accident_Growth_Pct
FROM Monthly_Accidents
LIMIT 12;`,
    explanation: 'Utilizes Common Table Expressions (CTE) and LAG() to measure seasonality spikes during monsoon (July-Aug) and winter fog (Dec-Jan).'
  },
  {
    id: 'q6',
    title: 'Primary Cause & Speeding Contribution Analysis',
    category: 'Factor Analysis',
    description: 'Groups accidents by primary driver cause (Over-speeding, Drunk Driving, Wrong-side, Mobile usage).',
    sql: `SELECT 
    primary_cause,
    COUNT(id) AS Accident_Count,
    ROUND((COUNT(id) * 100.0 / (SELECT COUNT(*) FROM road_accidents_india)), 2) AS Pct_Of_Total,
    SUM(fatalities) AS Fatalities,
    SUM(casualties) AS Total_Injured
FROM road_accidents_india
GROUP BY primary_cause
ORDER BY Accident_Count DESC;`,
    explanation: 'Uses subquery scalar calculation to determine the percentage share of each cause, highlighting Over-speeding as the primary driver.'
  },
  {
    id: 'q7',
    title: 'Night-time Unlit Road Blackspot Query',
    category: 'Safety & Compliance',
    description: 'Filters night-time crashes where lighting was dark or absent to assess infrastructure lighting deficits.',
    sql: `SELECT 
    state,
    road_type,
    COUNT(id) AS Dark_Night_Accidents,
    SUM(fatalities) AS Night_Fatalities
FROM road_accidents_india
WHERE time_slot = 'Night (21-06)' 
  AND lighting_condition = 'Dark / No Lights'
GROUP BY state, road_type
HAVING COUNT(id) > 15
ORDER BY Night_Fatalities DESC;`,
    explanation: 'Filters high-risk dark night highway stretches using HAVING clause to recommend street lighting installations to NHAI.'
  }
];

export interface SqlExecutionResult {
  headers: string[];
  rows: (string | number)[][];
  rowCount: number;
  executionTimeMs: number;
}

export function executeQueryOnDataset(sql: string, dataset: AccidentRecord[]): SqlExecutionResult {
  const startTime = performance.now();
  const lowerSql = sql.toLowerCase();

  // Basic KPI Query Q1
  if (lowerSql.includes('total_accidents') && lowerSql.includes('fatality_rate_pct')) {
    const totalAccidents = dataset.length;
    const totalFatalities = dataset.reduce((acc, r) => acc + r.fatalities, 0);
    const totalCasualties = dataset.reduce((acc, r) => acc + r.casualties, 0);
    const fatalityRatePct = (totalFatalities / (totalAccidents || 1)) * 100;
    const severeInjuries = dataset.filter(r => r.severity === 'Severe Injury').length;
    const severePct = (severeInjuries / (totalAccidents || 1)) * 100;

    return {
      headers: ['Total_Accidents', 'Total_Fatalities', 'Total_Casualties', 'Fatality_Rate_Pct', 'Severe_Injury_Pct'],
      rows: [[totalAccidents, totalFatalities, totalCasualties, `${fatalityRatePct.toFixed(2)}%`, `${severePct.toFixed(2)}%`]],
      rowCount: 1,
      executionTimeMs: Math.round(performance.now() - startTime)
    };
  }

  // State Ranking Q2 or state group
  if (lowerSql.includes('state_fatality_rank') || (lowerSql.includes('group by') && lowerSql.includes('state'))) {
    const stateMap = new Map<string, { count: number; fatalities: number }>();
    dataset.forEach(r => {
      const cur = stateMap.get(r.state) || { count: 0, fatalities: 0 };
      cur.count += 1;
      cur.fatalities += r.fatalities;
      stateMap.set(r.state, cur);
    });

    const sorted = Array.from(stateMap.entries())
      .sort((a, b) => b[1].fatalities - a[1].fatalities)
      .slice(0, 10);

    const rows = sorted.map(([state, data], idx) => [
      state,
      data.count,
      data.fatalities,
      (data.fatalities / (data.count || 1)).toFixed(2),
      idx + 1
    ]);

    return {
      headers: ['State', 'Total_Accidents', 'Total_Fatalities', 'Avg_Fatalities_Per_Accident', 'State_Fatality_Rank'],
      rows,
      rowCount: rows.length,
      executionTimeMs: Math.round(performance.now() - startTime)
    };
  }

  // Highway Hazard Q3
  if (lowerSql.includes('road_type')) {
    const roadMap = new Map<string, { count: number; fatalities: number; casualties: number }>();
    dataset.forEach(r => {
      const cur = roadMap.get(r.roadType) || { count: 0, fatalities: 0, casualties: 0 };
      cur.count += 1;
      cur.fatalities += r.fatalities;
      cur.casualties += r.casualties;
      roadMap.set(r.roadType, cur);
    });

    const rows = Array.from(roadMap.entries()).map(([road, data]) => [
      road,
      data.count,
      data.fatalities,
      `${((data.fatalities / (data.casualties || 1)) * 100).toFixed(2)}%`,
      (data.casualties / (data.count || 1)).toFixed(2)
    ]);

    return {
      headers: ['Road_Type', 'Accident_Count', 'Total_Fatalities', 'Casualty_Fatality_Ratio_Pct', 'Avg_Casualties_Per_Incident'],
      rows,
      rowCount: rows.length,
      executionTimeMs: Math.round(performance.now() - startTime)
    };
  }

  // Compliance Q4
  if (lowerSql.includes('helmet_belt_used')) {
    const map = new Map<string, { count: number; fatalities: number }>();
    dataset.filter(r => r.vehicleType === '2-Wheeler' || r.vehicleType === 'Car/SUV').forEach(r => {
      const key = `${r.vehicleType} | Worn: ${r.helmetOrBeltUsed}`;
      const cur = map.get(key) || { count: 0, fatalities: 0 };
      cur.count += 1;
      cur.fatalities += r.fatalities;
      map.set(key, cur);
    });

    const rows = Array.from(map.entries()).map(([key, data]) => {
      const [vType, worn] = key.split(' | Worn: ');
      return [
        vType,
        worn,
        data.count,
        data.fatalities,
        `${((data.fatalities / (data.count || 1)) * 100).toFixed(2)}%`
      ];
    });

    return {
      headers: ['Vehicle_Type', 'Helmet_Belt_Used', 'Total_Incidents', 'Fatalities', 'Incident_Fatality_Rate_Pct'],
      rows,
      rowCount: rows.length,
      executionTimeMs: Math.round(performance.now() - startTime)
    };
  }

  // Primary Cause Q6
  if (lowerSql.includes('primary_cause')) {
    const causeMap = new Map<string, { count: number; fatalities: number; casualties: number }>();
    dataset.forEach(r => {
      const cur = causeMap.get(r.primaryCause) || { count: 0, fatalities: 0, casualties: 0 };
      cur.count += 1;
      cur.fatalities += r.fatalities;
      cur.casualties += r.casualties;
      causeMap.set(r.primaryCause, cur);
    });

    const totalAcc = dataset.length;
    const rows = Array.from(causeMap.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .map(([cause, data]) => [
        cause,
        data.count,
        `${((data.count / (totalAcc || 1)) * 100).toFixed(2)}%`,
        data.fatalities,
        data.casualties
      ]);

    return {
      headers: ['Primary_Cause', 'Accident_Count', 'Pct_Of_Total', 'Fatalities', 'Total_Injured'],
      rows,
      rowCount: rows.length,
      executionTimeMs: Math.round(performance.now() - startTime)
    };
  }

  // Fallback default query preview
  const sample = dataset.slice(0, 10).map(r => [
    r.id,
    r.accidentDate,
    r.state,
    r.roadType,
    r.vehicleType,
    r.primaryCause,
    r.severity,
    r.fatalities
  ]);

  return {
    headers: ['Accident_ID', 'Date', 'State', 'Road_Type', 'Vehicle_Type', 'Primary_Cause', 'Severity', 'Fatalities'],
    rows: sample,
    rowCount: sample.length,
    executionTimeMs: Math.round(performance.now() - startTime)
  };
}
