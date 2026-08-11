export interface AccidentRecord {
  id: string;
  accidentDate: string;
  year: number;
  month: string;
  state: string;
  district: string;
  roadType: 'National Highway' | 'State Highway' | 'Urban Road' | 'Rural Road';
  vehicleType: '2-Wheeler' | 'Car/SUV' | 'Truck/Lorry' | 'Bus' | 'Auto-Rickshaw' | 'Pedestrian';
  severity: 'Fatal' | 'Severe Injury' | 'Minor Injury' | 'Non-Injury';
  casualties: number;
  fatalities: number;
  primaryCause: 'Over-speeding' | 'Drunk Driving' | 'Wrong-side Driving' | 'Weather/Fog' | 'Pothole/Bad Road' | 'Red Light Jumping' | 'Mobile Usage';
  timeSlot: 'Morning Peak (06-10)' | 'Day (10-16)' | 'Evening Peak (16-21)' | 'Night (21-06)';
  weatherCondition: 'Clear' | 'Rainy' | 'Dense Fog' | 'Dust Storm';
  lightingCondition: 'Daylight' | 'Street Lights On' | 'Dark / No Lights';
  helmetOrBeltUsed: 'Yes' | 'No';
}

export interface DashboardFilters {
  year: string;
  state: string;
  roadType: string;
  vehicleType: string;
  severity: string;
  primaryCause: string;
}

export interface SqlQueryItem {
  id: string;
  title: string;
  category: 'Basic Aggregations' | 'Window Functions & Ranking' | 'Factor Analysis' | 'Time Series & Growth' | 'Safety & Compliance';
  description: string;
  sql: string;
  explanation: string;
}

export interface PythonCodeCell {
  id: string;
  title: string;
  type: 'imports' | 'overview' | 'missing' | 'distribution' | 'correlation' | 'time_series' | 'geo_risk';
  code: string;
  outputSummary: string;
  insight: string;
}

export interface DaxMeasureItem {
  id: string;
  name: string;
  category: 'Core KPIs' | 'Severity & Rates' | 'Time Intelligence (YoY / MoM)' | 'Risk & Hazard Index';
  formula: string;
  description: string;
}

export interface PolicyRecommendation {
  id: string;
  title: string;
  targetArea: string;
  impactLevel: 'High' | 'Critical' | 'Medium';
  dataEvidence: string;
  actionablePlan: string;
}
