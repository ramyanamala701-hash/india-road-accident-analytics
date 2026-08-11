import React from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  MapPin
} from 'lucide-react';

export const InsightsPolicyTab: React.FC = () => {
  const recommendations = [
    {
      id: 'rec-1',
      title: 'Automated Speed Governor & ANPR Enforcement Grid',
      targetArea: 'National & State Highways',
      impactLevel: 'Critical',
      dataEvidence: 'Over-speeding accounts for 64.2% of total accidents and 52% of fatalities on National Highways.',
      actionablePlan: 'Install automated speed-detection cameras every 10 km on high-density arterial corridors (e.g., NH-44, NH-16) linked directly to the e-Challan database for instantaneous penalty levying.'
    },
    {
      id: 'rec-2',
      title: 'Mandatory AI Helmet Detection & VRU Safe Corridors',
      targetArea: 'Urban Arterials & Tier-2/3 Cities',
      impactLevel: 'Critical',
      dataEvidence: 'Two-wheeler riders suffered 48% of total casualties. Non-usage of helmets increased mortality risk by 3.42x.',
      actionablePlan: 'Deploy AI-enabled CCTV traffic cameras at urban junctions to detect helmet non-compliance automatically. Construct dedicated segregated two-wheeler and pedestrian lanes in metro regions.'
    },
    {
      id: 'rec-3',
      title: 'Highway Lighting & Reflective Fog Warning Infrastructure',
      targetArea: 'Northern Belt (Winter Fog Zones)',
      impactLevel: 'High',
      dataEvidence: 'Dense fog during Dec-Jan in UP, Punjab, Haryana, and Delhi NCR causes multi-vehicle pileups with a 1.8x fatality spike.',
      actionablePlan: 'Mandate retro-reflective cat-eye pavement markers, solar-powered flashing hazard lights, and thermal fog warning LED boards across all fog-prone national highway stretches.'
    },
    {
      id: 'rec-4',
      title: 'Trauma Care Golden Hour Response Centers',
      targetArea: 'District Highway Blackspots',
      impactLevel: 'High',
      dataEvidence: '42% of fatalities occur within 60 minutes of collision due to delayed medical intervention on remote highway stretches.',
      actionablePlan: 'Establish Advanced Life Support (ALS) 108 Ambulance stations every 30 km along identified highway blackspot districts with automated GPS dispatching.'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border-l-4 border-l-blue-500 border border-slate-800 rounded-sm p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 text-blue-400" />
            <span>MoRTH Policy & Strategic Road Safety Blueprint</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight uppercase">
            Data-Driven Interventions & Highway Safety Policy Proposals
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Actionable proposals derived from statistical evidence to reduce road fatalities in India by 50% in alignment with UN Sustainable Development Goals.
          </p>
        </div>
      </div>

      {/* Strategic Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-slate-900 border border-slate-800 rounded-sm p-6 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-blue-400 font-mono flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>{rec.targetArea}</span>
                </span>

                <span className={`text-[10px] px-2.5 py-0.5 rounded-sm font-bold uppercase tracking-wider ${
                  rec.impactLevel === 'Critical'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-blue-300 border border-slate-700'
                }`}>
                  {rec.impactLevel} Priority
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">{rec.title}</h3>

              {/* Data Evidence Callout */}
              <div className="bg-slate-950 p-3 rounded-sm border border-slate-800 text-xs text-slate-300 mb-3 space-y-1">
                <span className="text-blue-400 font-bold block uppercase text-[10px] tracking-wider">Empirical Data Evidence:</span>
                <p className="leading-relaxed text-[11px] text-slate-300">{rec.dataEvidence}</p>
              </div>

              {/* Action Plan */}
              <div className="space-y-1">
                <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-wider block">Actionable Implementation Plan:</span>
                <p className="text-xs text-slate-300 leading-relaxed text-[11px]">{rec.actionablePlan}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center space-x-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>MoRTH Standard Compliant</span>
              </span>
              <span className="text-slate-500 font-mono">Target: 2026-2030</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

