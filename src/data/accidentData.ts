import { AccidentRecord } from '../types';

export const INDIAN_STATES = [
  'Uttar Pradesh',
  'Tamil Nadu',
  'Maharashtra',
  'Karnataka',
  'Madhya Pradesh',
  'Rajasthan',
  'West Bengal',
  'Gujarat',
  'Kerala',
  'Delhi NCR',
  'Andhra Pradesh',
  'Telangana',
  'Punjab',
  'Haryana',
  'Odisha'
];

export const ROAD_TYPES: AccidentRecord['roadType'][] = [
  'National Highway',
  'State Highway',
  'Urban Road',
  'Rural Road'
];

export const VEHICLE_TYPES: AccidentRecord['vehicleType'][] = [
  '2-Wheeler',
  'Car/SUV',
  'Truck/Lorry',
  'Bus',
  'Auto-Rickshaw',
  'Pedestrian'
];

export const PRIMARY_CAUSES: AccidentRecord['primaryCause'][] = [
  'Over-speeding',
  'Drunk Driving',
  'Wrong-side Driving',
  'Weather/Fog',
  'Pothole/Bad Road',
  'Red Light Jumping',
  'Mobile Usage'
];

export const TIME_SLOTS: AccidentRecord['timeSlot'][] = [
  'Morning Peak (06-10)',
  'Day (10-16)',
  'Evening Peak (16-21)',
  'Night (21-06)'
];

export const WEATHER_CONDITIONS: AccidentRecord['weatherCondition'][] = [
  'Clear',
  'Rainy',
  'Dense Fog',
  'Dust Storm'
];

const STATE_DISTRICTS: Record<string, string[]> = {
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 'Noida'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
  'West Bengal': ['Kolkata', 'Howrah', 'Siliguri', 'Asansol', 'Durgapur'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
  'Delhi NCR': ['Central Delhi', 'South Delhi', 'Gurugram', 'Faridabad', 'Noida'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
  'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri']
};

// Deterministic seed generator for stable realistic dataset
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function generateAccidentDataset(count: number = 2500): AccidentRecord[] {
  const dataset: AccidentRecord[] = [];
  const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 1; i <= count; i++) {
    const rnd1 = seededRandom(i * 1.1);
    const rnd2 = seededRandom(i * 2.3);
    const rnd3 = seededRandom(i * 3.7);
    const rnd4 = seededRandom(i * 4.2);
    const rnd5 = seededRandom(i * 5.8);
    const rnd6 = seededRandom(i * 6.4);
    const rnd7 = seededRandom(i * 7.1);

    // Weighted State Selection (Uttar Pradesh & Tamil Nadu & Maharashtra have highest accident density)
    let state = INDIAN_STATES[0];
    if (rnd1 > 0.85) state = 'Uttar Pradesh';
    else if (rnd1 > 0.72) state = 'Tamil Nadu';
    else if (rnd1 > 0.60) state = 'Maharashtra';
    else if (rnd1 > 0.50) state = 'Karnataka';
    else if (rnd1 > 0.40) state = 'Madhya Pradesh';
    else if (rnd1 > 0.30) state = 'Rajasthan';
    else if (rnd1 > 0.22) state = 'Gujarat';
    else if (rnd1 > 0.15) state = 'Kerala';
    else state = INDIAN_STATES[Math.floor(rnd2 * INDIAN_STATES.length)];

    const districts = STATE_DISTRICTS[state] || ['Central District'];
    const district = districts[Math.floor(rnd3 * districts.length)];

    // Year distribution with slight increase over time (dip in 2020 COVID lock-down)
    const year = years[Math.floor(rnd4 * years.length)];
    const month = months[Math.floor(rnd5 * months.length)];
    const day = Math.floor(rnd6 * 28) + 1;
    const accidentDate = `${year}-${String(months.indexOf(month) + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Road Type: National Highways represent ~36% of severe accidents in India
    let roadType: AccidentRecord['roadType'] = 'National Highway';
    if (rnd2 > 0.65) roadType = 'State Highway';
    else if (rnd2 > 0.35) roadType = 'Urban Road';
    else if (rnd2 > 0.15) roadType = 'Rural Road';

    // Vehicle Type: 2-Wheelers (~45%), Cars (~22%), Commercial Trucks (~18%)
    let vehicleType: AccidentRecord['vehicleType'] = '2-Wheeler';
    if (rnd3 > 0.55) vehicleType = 'Car/SUV';
    else if (rnd3 > 0.35) vehicleType = 'Truck/Lorry';
    else if (rnd3 > 0.20) vehicleType = 'Auto-Rickshaw';
    else if (rnd3 > 0.10) vehicleType = 'Pedestrian';
    else if (rnd3 > 0.03) vehicleType = 'Bus';

    // Primary Cause: Over-speeding (~65%), Drunk Driving (~10%), Wrong-side (~10%)
    let primaryCause: AccidentRecord['primaryCause'] = 'Over-speeding';
    if (rnd4 > 0.75) primaryCause = 'Drunk Driving';
    else if (rnd4 > 0.62) primaryCause = 'Wrong-side Driving';
    else if (rnd4 > 0.52) primaryCause = 'Weather/Fog';
    else if (rnd4 > 0.42) primaryCause = 'Mobile Usage';
    else if (rnd4 > 0.32) primaryCause = 'Pothole/Bad Road';
    else if (rnd4 > 0.22) primaryCause = 'Red Light Jumping';

    // Time Slot: Evening Peak (16-21) is highest hazard
    let timeSlot: AccidentRecord['timeSlot'] = 'Evening Peak (16-21)';
    if (rnd5 > 0.60) timeSlot = 'Day (10-16)';
    else if (rnd5 > 0.35) timeSlot = 'Night (21-06)';
    else if (rnd5 > 0.15) timeSlot = 'Morning Peak (06-10)';

    // Weather & Lighting
    let weatherCondition: AccidentRecord['weatherCondition'] = 'Clear';
    if (month === 'Dec' || month === 'Jan') {
      if (rnd6 > 0.5) weatherCondition = 'Dense Fog';
    } else if (month === 'Jul' || month === 'Aug') {
      if (rnd6 > 0.4) weatherCondition = 'Rainy';
    }

    const lightingCondition: AccidentRecord['lightingCondition'] =
      timeSlot === 'Night (21-06)'
        ? rnd7 > 0.5 ? 'Dark / No Lights' : 'Street Lights On'
        : 'Daylight';

    // Helmet or Seatbelt usage
    const helmetOrBeltUsed: AccidentRecord['helmetOrBeltUsed'] = rnd7 > 0.58 ? 'Yes' : 'No';

    // Severity & Casualties logic (High speed + National Highway + No Helmet = higher fatalities)
    let severity: AccidentRecord['severity'] = 'Minor Injury';
    let casualties = 1;
    let fatalities = 0;

    const riskScore =
      (roadType === 'National Highway' ? 2 : 1) +
      (primaryCause === 'Over-speeding' || primaryCause === 'Drunk Driving' ? 2 : 1) +
      (vehicleType === '2-Wheeler' || vehicleType === 'Pedestrian' ? 2 : 1) +
      (helmetOrBeltUsed === 'No' ? 2 : 0) +
      (timeSlot === 'Night (21-06)' ? 1 : 0);

    if (riskScore >= 7 && rnd6 > 0.35) {
      severity = 'Fatal';
      fatalities = Math.floor(rnd7 * 2) + 1; // 1 to 2 fatalities
      casualties = fatalities + Math.floor(rnd6 * 3);
    } else if (riskScore >= 5 && rnd6 > 0.25) {
      severity = 'Severe Injury';
      fatalities = rnd7 > 0.85 ? 1 : 0;
      casualties = Math.floor(rnd6 * 3) + 1;
    } else if (riskScore >= 3) {
      severity = 'Minor Injury';
      casualties = Math.floor(rnd6 * 2) + 1;
    } else {
      severity = 'Non-Injury';
      casualties = rnd6 > 0.7 ? 1 : 0;
    }

    dataset.push({
      id: `IND-ACC-${100000 + i}`,
      accidentDate,
      year,
      month,
      state,
      district,
      roadType,
      vehicleType,
      severity,
      casualties,
      fatalities,
      primaryCause,
      timeSlot,
      weatherCondition,
      lightingCondition,
      helmetOrBeltUsed
    });
  }

  return dataset;
}

export const ACCIDENT_DATASET = generateAccidentDataset(2500);
