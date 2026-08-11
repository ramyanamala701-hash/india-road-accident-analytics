import { DaxMeasureItem } from '../types';

export const POWERBI_DAX_MEASURES: DaxMeasureItem[] = [
  {
    id: 'dax-1',
    name: 'Total Accidents',
    category: 'Core KPIs',
    formula: `Total Accidents = COUNTROWS('Fact_Accidents')`,
    description: 'Counts total recorded road accident instances in the active filter context.'
  },
  {
    id: 'dax-2',
    name: 'Total Fatalities',
    category: 'Core KPIs',
    formula: `Total Fatalities = SUM('Fact_Accidents'[fatalities])`,
    description: 'Sum of deceased victims resulting from road accidents.'
  },
  {
    id: 'dax-3',
    name: 'Fatality Rate %',
    category: 'Severity & Rates',
    formula: `Fatality Rate % = 
DIVIDE(
    [Total Fatalities],
    [Total Accidents],
    0
) * 100`,
    description: 'Percentage of accidents that resulted in at least one death.'
  },
  {
    id: 'dax-4',
    name: 'Highway Hazard Share %',
    category: 'Risk & Hazard Index',
    formula: `Highway Hazard Share % = 
VAR HighwayDeaths = 
    CALCULATE(
        [Total Fatalities],
        'Dim_RoadType'[Road_Type] IN {"National Highway", "State Highway"}
    )
RETURN
    DIVIDE(HighwayDeaths, [Total Fatalities], 0) * 100`,
    description: 'Measures the percentage of total fatalities occurring on expressways and highways.'
  },
  {
    id: 'dax-5',
    name: 'YoY Accident Growth %',
    category: 'Time Intelligence (YoY / MoM)',
    formula: `YoY Accident Growth % = 
VAR CurrentYear = [Total Accidents]
VAR PreviousYear = 
    CALCULATE(
        [Total Accidents],
        SAMEPERIODLASTYEAR('Dim_Date'[Date])
    )
RETURN
    IF(
        ISBLANK(PreviousYear),
        BLANK(),
        DIVIDE(CurrentYear - PreviousYear, PreviousYear, 0) * 100
    )`,
    description: 'Calculates Year-over-Year percentage change in accident occurrences.'
  },
  {
    id: 'dax-6',
    name: 'Non-Compliance Vulnerability Ratio',
    category: 'Risk & Hazard Index',
    formula: `Non-Compliance Vulnerability Ratio = 
VAR NonCompliantDeaths = 
    CALCULATE(
        [Total Fatalities],
        'Fact_Accidents'[helmet_belt_used] = "No"
    )
VAR CompliantDeaths = 
    CALCULATE(
        [Total Fatalities],
        'Fact_Accidents'[helmet_belt_used] = "Yes"
    )
RETURN
    DIVIDE(NonCompliantDeaths, CompliantDeaths, 1)`,
    description: 'Ratio of deaths without safety equipment vs with safety equipment.'
  },
  {
    id: 'dax-7',
    name: 'Weighted Blackspot Risk Score',
    category: 'Risk & Hazard Index',
    formula: `Blackspot Risk Score = 
([Total Fatalities] * 5) + 
(CALCULATE([Total Accidents], 'Fact_Accidents'[severity] = "Severe Injury") * 2) + 
[Total Accidents]`,
    description: 'Composite severity index used by MoRTH traffic engineering to prioritize road infrastructure grants.'
  }
];

export const STAR_SCHEMA_TABLES = [
  {
    name: 'Fact_Accidents',
    type: 'Fact Table',
    columns: ['accident_id (PK)', 'date_key (FK)', 'state_id (FK)', 'vehicle_id (FK)', 'road_id (FK)', 'cause_id (FK)', 'casualties', 'fatalities', 'severity', 'time_slot', 'weather', 'helmet_belt_used']
  },
  {
    name: 'Dim_State',
    type: 'Dimension Table',
    columns: ['state_id (PK)', 'state_name', 'zone (North/South/East/West)', 'population_density', 'registered_vehicles']
  },
  {
    name: 'Dim_Date',
    type: 'Dimension Table',
    columns: ['date_key (PK)', 'full_date', 'year', 'quarter', 'month', 'month_name', 'day_of_week', 'is_weekend']
  },
  {
    name: 'Dim_Vehicle',
    type: 'Dimension Table',
    columns: ['vehicle_id (PK)', 'vehicle_type', 'category (Light/Heavy/VRU)', 'vulnerable_road_user_flag']
  },
  {
    name: 'Dim_RoadType',
    type: 'Dimension Table',
    columns: ['road_id (PK)', 'road_type', 'speed_limit_kph', 'jurisdiction (NHAI/PWD/Municipal)']
  }
];
