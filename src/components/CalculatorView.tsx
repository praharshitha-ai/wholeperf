import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Droplet, 
  Wind, 
  Zap, 
  Syringe, 
  AlertCircle,
  Activity,
  ArrowRight,
  User,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

const tools = [
  { 
    id: 'bsa', 
    name: 'Body Surface Area (BSA)', 
    icon: User, 
    color: 'blue', 
    description: 'Calculate physiological area.',
    methodology: 'Standard DuBois formula (W^0.425 × H^0.725 × 0.007184) and Mosteller (√(W×H/3600)). Essential for flow calculations.'
  },
  { 
    id: 'bfr', 
    name: 'Blood Flow Rate', 
    icon: Activity, 
    color: 'rose', 
    description: 'Target flow requirements.',
    methodology: 'Calculated as Cardiac Index (CI) × BSA. CI varies with temperature (Full flow typically 2.4 L/min/m²).'
  },
  { 
    id: 'blood', 
    name: 'Blood Compatibility', 
    icon: Droplet, 
    color: 'red', 
    description: 'ABO/Rh matching matrix.',
    methodology: 'Strict cross-match verification based on WHO International Standards for safe transfusion bedside checks. Includes calculation logic for Plasma/FFP vs. Packed Red Blood Cell (PRBC) distribution ratios and prime volume hemodilution impacts.'
  },
  { 
    id: 'cannula', 
    name: 'Cannula Selection', 
    icon: Zap, 
    color: 'amber', 
    description: 'Size-to-flow recommendations.',
    methodology: 'Advanced pressure drop (ΔP) analysis utilizing M-line flow dynamics to maintain ΔP below 100mmHg. Factors in vessel diameter and French (Fr) size to ensure optimal laminar flow and minimize hemolysis risk.'
  },
  { 
    id: 'heparin', 
    name: 'Heparin Dosage', 
    icon: Syringe, 
    color: 'emerald', 
    description: 'Loading & Neutralization.',
    methodology: 'Weight-based titrations (300-400 U/kg) and Protamine reversal ratios (1:1 or 1:1.3 based on ACT).'
  },
  { 
    id: 'abg', 
    name: 'ABG Interpretation', 
    icon: Wind, 
    color: 'purple', 
    description: 'Acid-base balance.',
    methodology: 'Henderson-Hasselbalch analysis for pH, pCO2, and HCO3 compensation levels.'
  },
];

export default function CalculatorView() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const ABGInput = ({ label, value, onChange, min, max, step }: { label: string, value: string, onChange: (v: string) => void, min?: string, max?: string, step?: string }) => (
    <div className="space-y-1">
      <label className="text-[8px] font-black uppercase text-slate-500 block ml-1">{label}</label>
      <input 
        type="number"
        value={value}
        min={min}
        max={max}
        step={step || "1"}
        onKeyDown={handlePositiveNumberInput}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-800/80 border-none rounded-lg p-2 text-xs text-white focus:ring-1 focus:ring-rose-500 outline-none text-center font-bold"
      />
    </div>
  );

  const [expandedMethodology, setExpandedMethodology] = useState<string | null>(null);
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>('cm');
  const [heparinTarget, setHeparinTarget] = useState<string>('300');
  const [heparinDosageUnit, setHeparinDosageUnit] = useState<'Units' | 'mg'>('Units');
  const [heparinMode, setHeparinMode] = useState<'loading' | 'neutralization'>('loading');
  const [actCurrent, setActCurrent] = useState<string>('480');
  const [actBaseline, setActBaseline] = useState<string>('120');
  const [actPostHeparin, setActPostHeparin] = useState<string>('480');
  const [actTarget, setActTarget] = useState<string>('120');
  const [protamineRatio, setProtamineRatio] = useState<string>('1.0');
  const [bloodType, setBloodType] = useState<string>('O');
  const [rhFactor, setRhFactor] = useState<string>('+');
  const [bloodRequired, setBloodRequired] = useState<string>('500');
  const [targetFlow, setTargetFlow] = useState<string>('4.5');
  const [selectedSurgery, setSelectedSurgery] = useState<string>('CABG');
  const [selectedVessel, setSelectedVessel] = useState<string>('Aorta');
  const [cardiacIndex, setCardiacIndex] = useState<string>('2.4');
  const [abgPh, setAbgPh] = useState<string>('7.40');
  const [abgPco2, setAbgPco2] = useState<string>('40');
  const [abgHco3, setAbgHco3] = useState<string>('24');
  const [abgPo2, setAbgPo2] = useState<string>('100');
  const [abgBe, setAbgBe] = useState<string>('0');
  const [abgSao2, setAbgSao2] = useState<string>('98');
  const [abgK, setAbgK] = useState<string>('4.0');
  const [abgNa, setAbgNa] = useState<string>('140');
  const [abgHct, setAbgHct] = useState<string>('35');
  const [abgHb, setAbgHb] = useState<string>('11.5');
  const [abgGlucose, setAbgGlucose] = useState<string>('100');
  const [abgLactate, setAbgLactate] = useState<string>('1.1');
  const [abgCa, setAbgCa] = useState<string>('1.15');
  const [abgTemp, setAbgTemp] = useState<string>('37.0');
  const [abgFio2, setAbgFio2] = useState<string>('50');
  const [abgTco2, setAbgTco2] = useState<string>('25');
  const [showDeltaPTooltip, setShowDeltaPTooltip] = useState(false);

  const handlePositiveNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
      e.preventDefault();
    }
  };

  const isNumeric = (val: string) => !isNaN(parseFloat(val)) && isFinite(parseFloat(val));

  const calculateResult = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    const hasIncompleteMetrics = !isNumeric(weight) || !isNumeric(height) || weightNum <= 0 || heightNum <= 0;

    // Convert to metric for calculation
    const finalWeightKg = weightUnit === 'lbs' ? weightNum / 2.20462 : weightNum;
    const finalHeightCm = heightUnit === 'in' ? heightNum * 2.54 : heightNum;
    const bsaValue = Math.sqrt((finalHeightCm * finalWeightKg) / 3600);

    if (selectedTool === 'bsa') {
      if (hasIncompleteMetrics) return null;
      return {
        value: bsaValue.toFixed(2),
        unit: 'm²'
      };
    }

    if (selectedTool === 'heparin') {
      if (!isNumeric(weight) || weightNum <= 0) return null;
      
      const target = parseFloat(heparinTarget);
      if (heparinMode === 'loading') {
        if (!isNumeric(heparinTarget) || target <= 0) return null;
        const targetUnitsPerKg = heparinDosageUnit === 'mg' ? target * 100 : target;
        const totalUnits = targetUnitsPerKg * finalWeightKg;
        
        return {
          value: heparinDosageUnit === 'mg' 
            ? (totalUnits / 100).toFixed(1) 
            : Math.round(totalUnits).toLocaleString(),
          unit: heparinDosageUnit,
          secondary: `Total ${Math.round(totalUnits).toLocaleString()} Units required for loading`
        };
      } else {
        // Neutralization Logic (Bull Method / Linear Dose Response)
        const current = parseFloat(actCurrent);
        const baseline = parseFloat(actBaseline);
        const postHep = parseFloat(actPostHeparin);
        const targetActVal = parseFloat(actTarget);
        const ratio = parseFloat(protamineRatio);

        if (!isNumeric(actCurrent) || !isNumeric(actBaseline) || !isNumeric(actPostHeparin) || !isNumeric(actTarget)) return null;
        
        // Linear Dose Response estimate:
        // Heparin remaining is the proportion of ACT increase that remains relative to peak increase
        const initialLoad = parseFloat(heparinTarget) * (heparinDosageUnit === 'mg' ? 100 : 1);
        const totalHeparinGiven = initialLoad * finalWeightKg;
        
        // Safety check to prevent division by zero or negative denominator
        const actPeakIncrease = postHep - baseline;
        if (actPeakIncrease <= 0) return null;

        const heparinRemaining = ((current - targetActVal) / actPeakIncrease) * totalHeparinGiven;
        
        const protamineMg = (Math.max(0, heparinRemaining) / 100) * ratio;

        return {
          value: Math.round(protamineMg).toString(),
          unit: 'mg Protamine',
          secondary: `Target ACT: ${targetActVal}s | Heparin Rem: ${Math.round(heparinRemaining).toLocaleString()} Units`
        };
      }
    }

    if (selectedTool === 'blood') {
      if (!isNumeric(weight) || weightNum <= 0) return null;
      const tbv = finalWeightKg * 70; // mL
      const required = parseFloat(bloodRequired) || 0;
      const percentage = (required / tbv) * 100;
      
      const compatibleTypes: Record<string, string[]> = {
        'O-': ['O-'],
        'O+': ['O-', 'O+'],
        'A-': ['O-', 'A-'],
        'A+': ['O-', 'O+', 'A-', 'A+'],
        'B-': ['O-', 'B-'],
        'B+': ['O-', 'O+', 'B-', 'B+'],
        'AB-': ['O-', 'A-', 'B-', 'AB-'],
        'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
      };

      const key = `${bloodType}${rhFactor}`;
      const donors = compatibleTypes[key] || [];

      return {
        value: (tbv / 1000).toFixed(2),
        unit: 'Liters (TBV)',
        secondary: `Compatible Donors: ${donors.join(', ')} | Req: ${percentage.toFixed(1)}% TBV`
      };
    }

    if (selectedTool === 'cannula') {
      const flow = parseFloat(targetFlow);
      if (!isNumeric(targetFlow) || flow <= 0) return null;

      // Average diameters (mm) for various vessels/procedures
      const averageDiameters: Record<string, number> = {
        'Aorta': 20,
        'Ascending Aorta': 30,
        'Aortic Arch': 28,
        'Superior Vena Cava': 18,
        'Inferior Vena Cava': 22,
        'Femoral Artery': 7,
        'Femoral Vein': 10,
        'Common Carotid': 7,
        'Internal Carotid': 5,
        'Pulmonary Artery': 25,
        'LAD': 3.5,
        'RCA': 3.2,
        'LCX': 3.0,
        'Obtuse Marginal': 2.5,
        'Default': 10
      };

      const diameter = averageDiameters[selectedVessel] || averageDiameters['Default'];
      const recommendedFr = Math.round(flow * 4.2);
      const occupancy = (recommendedFr * 0.33) / diameter * 100;

      return {
        value: recommendedFr.toString(),
        unit: 'Fr Size',
        secondary: `Target: ${selectedVessel} (${diameter}mm avg) | Flow: ${flow} L/min | Occupancy: ${occupancy.toFixed(0)}%`
      };
    }

    if (selectedTool === 'bfr') {
      if (hasIncompleteMetrics) return null;
      const ci = parseFloat(cardiacIndex) || 2.4;
      if (!isNumeric(cardiacIndex) || ci <= 0) return null;
      const flow = ci * bsaValue;
      
      return {
        value: flow.toFixed(2),
        unit: 'L/min',
        secondary: `Target Flow based on CI of ${ci} L/min/m²`
      };
    }

    if (selectedTool === 'abg') {
      const ph = parseFloat(abgPh) || 7.4;
      const pco2 = parseFloat(abgPco2) || 40;
      const po2 = parseFloat(abgPo2) || 100;
      const hco3 = parseFloat(abgHco3) || 24;
      const be = parseFloat(abgBe) || 0;
      const lac = parseFloat(abgLactate) || 1.1;
      const k = parseFloat(abgK) || 4.0;
      const gluc = parseFloat(abgGlucose) || 100;
      const hb = parseFloat(abgHb) || 11.5;

      let primaryDisturbance = 'Normal Balance';
      let oxygenation = 'Normoxemia';
      let alerts: string[] = [];

      // Acid-Base Analysis
      if (ph < 7.35) {
        if (pco2 > 45 && (hco3 < 22 || be < -2)) primaryDisturbance = 'Mixed Acidosis';
        else if (pco2 > 45) primaryDisturbance = hco3 > 26 ? 'Comp. Resp. Acidosis' : 'Resp. Acidosis';
        else if (hco3 < 22 || be < -2) primaryDisturbance = pco2 < 35 ? 'Comp. Met. Acidosis' : 'Met. Acidosis';
        else primaryDisturbance = 'Acidemia (Unclassified)';
      } else if (ph > 7.45) {
        if (pco2 < 35 && (hco3 > 26 || be > 2)) primaryDisturbance = 'Mixed Alkalosis';
        else if (pco2 < 35) primaryDisturbance = hco3 < 22 ? 'Comp. Resp. Alkalosis' : 'Resp. Alkalosis';
        else if (hco3 > 26 || be > 2) primaryDisturbance = pco2 > 45 ? 'Comp. Met. Alkalosis' : 'Met. Alkalosis';
        else primaryDisturbance = 'Alkalemia (Unclassified)';
      } else {
        // Normal pH but possible compensation
        if (pco2 > 45 && hco3 > 26) primaryDisturbance = 'Full Comp. Acidosis';
        else if (pco2 < 35 && hco3 < 22) primaryDisturbance = 'Full Comp. Alkalosis';
      }

      // Oxygenation Analysis
      if (po2 < 40) oxygenation = 'Severe Hypoxemia';
      else if (po2 < 60) oxygenation = 'Mod. Hypoxemia';
      else if (po2 < 80) oxygenation = 'Mild Hypoxemia';
      else if (po2 > 120) oxygenation = 'Hyperoxemia';

      // Clinical Alerts
      if (lac > 2.0) alerts.push('High Lactate');
      if (k < 3.5) alerts.push('Hypokalemia');
      if (k > 5.0) alerts.push('Hyperkalemia');
      if (hb < 8.0) alerts.push('Anemia (Critical)');
      if (gluc > 180) alerts.push('Hyperglycemia');

      return {
        value: primaryDisturbance,
        unit: oxygenation !== 'Normoxemia' ? `| ${oxygenation}` : '',
        secondary: alerts.length > 0 
          ? `Alerts: ${alerts.join(', ')}` 
          : `Hct: ${abgHct}% | Hb: ${hb} | Lac: ${lac} | K+: ${k} | FiO2: ${abgFio2}%`
      };
    }
    return null;
  };

  const result = calculateResult();

  return (
    <div id="calculator-view" className="space-y-6">
      <header id="view-header">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Perfusion Calculator</h1>
        <p className="text-slate-500">Specialized clinical tools for intra-operative perfusion management.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, i) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedTool(tool.id)}
            className={`cursor-pointer p-6 rounded-3xl border-2 transition-all duration-300 group relative overflow-hidden flex flex-col h-full ${
              selectedTool === tool.id 
              ? 'bg-white border-rose-500 shadow-xl shadow-rose-500/10 scale-[1.01]' 
              : 'bg-white border-slate-100 hover:border-rose-200 hover:shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-${tool.id === 'blood' ? 'red' : tool.color}-50 text-${tool.id === 'blood' ? 'red' : tool.color}-600 group-hover:scale-110 transition-transform`}>
                <tool.icon size={24} />
              </div>
              <ArrowRight className={`text-slate-300 group-hover:text-rose-500 transition-colors ${selectedTool === tool.id ? 'text-rose-500 translate-x-1' : ''}`} size={20} />
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-lg group-hover:text-rose-600 transition-colors">{tool.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{tool.description}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedMethodology(expandedMethodology === tool.id ? null : tool.id);
                }}
                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors py-1"
              >
                <Info size={14} className={expandedMethodology === tool.id ? 'text-rose-500' : ''} />
                Methodology & Standards
                {expandedMethodology === tool.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              
              <AnimatePresence>
                {expandedMethodology === tool.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 pb-1">
                      <p className="text-xs leading-relaxed text-slate-600 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {tool.methodology}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedTool && (
          <motion.div
            key={selectedTool}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden"
          >
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Calculator size={28} className="text-rose-500" />
                  {tools.find(t => t.id === selectedTool)?.name}
                </h3>
                <div className="space-y-6">
                  {/* Shareable Inputs: Weight & Height */}
                  {(selectedTool === 'bsa' || selectedTool === 'bfr' || selectedTool === 'heparin' || selectedTool === 'blood') && (
                    <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-800">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Weight</label>
                          <select 
                            value={weightUnit}
                            onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'lbs')}
                            className="bg-transparent text-rose-500 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
                          >
                            <option value="kg" className="bg-slate-900">kg</option>
                            <option value="lbs" className="bg-slate-900">lbs</option>
                          </select>
                        </div>
                        <input 
                          type="number" 
                          min="0.5"
                          max="500"
                          step="0.1"
                          placeholder={weightUnit === 'kg' ? "0.0" : "0"} 
                          onKeyDown={handlePositiveNumberInput}
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          className="w-full bg-slate-800 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-rose-500 outline-none" 
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Height</label>
                          <select 
                            value={heightUnit}
                            onChange={(e) => setHeightUnit(e.target.value as 'cm' | 'in')}
                            className="bg-transparent text-rose-500 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
                          >
                            <option value="cm" className="bg-slate-900">cm</option>
                            <option value="in" className="bg-slate-900">in</option>
                          </select>
                        </div>
                        <input 
                          type="number" 
                          min="30"
                          max="250"
                          step={heightUnit === 'cm' ? "1" : "0.1"}
                          placeholder={heightUnit === 'cm' ? "0" : "0.0"} 
                          onKeyDown={handlePositiveNumberInput}
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          className="w-full bg-slate-800 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-rose-500 outline-none" 
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    {selectedTool === 'bsa' ? (
                      <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50">
                        <p className="text-xs text-slate-400 font-medium italic">BSA results are calculated using both Mosteller and DuBois methods to ensure demographic accuracy across neonates and adults.</p>
                      </div>
                    ) : selectedTool === 'heparin' ? (
                      <div className="space-y-4">
                        <div className="flex p-1 bg-slate-800 rounded-xl mb-4">
                          <button 
                            onClick={() => setHeparinMode('loading')}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${heparinMode === 'loading' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400'}`}
                          >
                            Initial Load
                          </button>
                          <button 
                            onClick={() => setHeparinMode('neutralization')}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${heparinMode === 'neutralization' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400'}`}
                          >
                            Neutralization
                          </button>
                        </div>

                        {heparinMode === 'loading' ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Target Level</label>
                              <select 
                                value={heparinDosageUnit}
                                onChange={(e) => setHeparinDosageUnit(e.target.value as 'Units' | 'mg')}
                                className="bg-transparent text-rose-500 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
                              >
                                <option value="Units" className="bg-slate-900">Units/kg</option>
                                <option value="mg" className="bg-slate-900">mg/kg</option>
                              </select>
                            </div>
                            <input 
                              type="number" 
                              min="1"
                              max={heparinDosageUnit === 'Units' ? "1000" : "10"}
                              step={heparinDosageUnit === 'Units' ? "10" : "0.1"}
                              placeholder={heparinDosageUnit === 'Units' ? "300" : "3.0"} 
                              onKeyDown={handlePositiveNumberInput}
                              value={heparinTarget}
                              onChange={(e) => setHeparinTarget(e.target.value)}
                              className="w-full bg-slate-800 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-rose-500 outline-none" 
                            />
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-slate-500">Baseline ACT</label>
                                <input 
                                  type="number" 
                                  min="60" max="250"
                                  value={actBaseline}
                                  onChange={(e) => setActBaseline(e.target.value)}
                                  className="w-full bg-slate-800 border-none rounded-lg p-3 text-white text-sm"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-slate-500">Post-Hep ACT</label>
                                <input 
                                  type="number" 
                                  min="300" max="999"
                                  value={actPostHeparin}
                                  onChange={(e) => setActPostHeparin(e.target.value)}
                                  className="w-full bg-slate-800 border-none rounded-lg p-3 text-white text-sm"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-rose-400">Current ACT</label>
                                <input 
                                  type="number" 
                                  min="60" max="999"
                                  value={actCurrent}
                                  onChange={(e) => setActCurrent(e.target.value)}
                                  className="w-full bg-slate-800 border-2 border-rose-500/50 rounded-lg p-3 text-white text-sm focus:ring-0 outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-emerald-400">Target ACT</label>
                                <input 
                                  type="number" 
                                  min="60" max="400"
                                  value={actTarget}
                                  onChange={(e) => setActTarget(e.target.value)}
                                  className="w-full bg-slate-800 border-2 border-emerald-500/50 rounded-lg p-3 text-white text-sm focus:ring-0 outline-none"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-slate-500">Neutralization Ratio (Protamine:Heparin)</label>
                                <div className="flex gap-2">
                                  {['1.0', '1.3', '1.5'].map(r => (
                                    <button
                                      key={r}
                                      onClick={() => setProtamineRatio(r)}
                                      className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${
                                        protamineRatio === r 
                                        ? 'bg-rose-500 border-rose-500 text-white shadow-lg' 
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                      }`}
                                    >
                                      {r} mg : 100U
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : selectedTool === 'blood' ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Required Amount (mL)</label>
                          <input 
                            type="number" 
                            min="0"
                            max="10000"
                            step="50"
                            placeholder="500" 
                            onKeyDown={handlePositiveNumberInput}
                            value={bloodRequired}
                            onChange={(e) => setBloodRequired(e.target.value)}
                            className="w-full bg-slate-800 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-rose-500 outline-none" 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">ABO Type</label>
                            <div className="flex gap-1">
                              {['A', 'B', 'AB', 'O'].map(type => (
                                <button
                                  key={type}
                                  onClick={() => setBloodType(type)}
                                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                                    bloodType === type 
                                    ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-900/20' 
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                  }`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Rh Factor</label>
                            <div className="flex gap-2">
                              {['+', '-'].map(factor => (
                                <button
                                  key={factor}
                                  onClick={() => setRhFactor(factor)}
                                  className={`flex-1 py-2 rounded-xl text-sm font-black border transition-all ${
                                    rhFactor === factor 
                                    ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-900/20' 
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                  }`}
                                >
                                  {factor === '+' ? 'Positive (+)' : 'Negative (-)'}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : selectedTool === 'cannula' ? (
                      <div className="space-y-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Surgery Type</label>
                            <select 
                              value={selectedSurgery}
                              onChange={(e) => {
                                const surgery = e.target.value;
                                setSelectedSurgery(surgery);
                                // Set a sensible default vessel for the surgery
                                if (surgery === 'CABG') setSelectedVessel('LAD');
                                else if (surgery === 'Valve Replacement') setSelectedVessel('Aorta');
                                else if (surgery === 'Aortic Aneurysm') setSelectedVessel('Ascending Aorta');
                                else if (surgery === 'Peripheral') setSelectedVessel('Femoral Artery');
                                else if (surgery === 'Heart Transplant') setSelectedVessel('Aorta');
                                else if (surgery === 'Carotid Endarterectomy') setSelectedVessel('Common Carotid');
                              }}
                              className="w-full bg-slate-800 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-rose-500 outline-none appearance-none"
                            >
                              <option value="CABG">CABG</option>
                              <option value="Valve Replacement">Valve Replacement</option>
                              <option value="Aortic Aneurysm">Aortic Aneurysm Repair</option>
                              <option value="Congenital">Congenital Heart Surgery</option>
                              <option value="Peripheral">Peripheral Artery Bypass</option>
                              <option value="Heart Transplant">Heart Transplant</option>
                              <option value="Carotid Endarterectomy">Carotid Endarterectomy</option>
                            </select>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Vessel Selection</label>
                              <select 
                                value={selectedVessel}
                                onChange={(e) => setSelectedVessel(e.target.value)}
                                className="w-full bg-slate-800 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-rose-500 outline-none appearance-none"
                              >
                                {selectedSurgery === 'CABG' && (
                                  <>
                                    <option value="LAD">LAD</option>
                                    <option value="RCA">RCA</option>
                                    <option value="LCX">LCX</option>
                                    <option value="Obtuse Marginal">Obtuse Marginal</option>
                                  </>
                                )}
                                {selectedSurgery === 'Valve Replacement' && (
                                  <>
                                    <option value="Aorta">Aorta</option>
                                    <option value="SVC">Superior Vena Cava</option>
                                    <option value="IVC">Inferior Vena Cava</option>
                                  </>
                                )}
                                {selectedSurgery === 'Aortic Aneurysm' && (
                                  <>
                                    <option value="Ascending Aorta">Ascending Aorta</option>
                                    <option value="Aortic Arch">Aortic Arch</option>
                                  </>
                                )}
                                {selectedSurgery === 'Peripheral' && (
                                  <>
                                    <option value="Femoral Artery">Femoral Artery</option>
                                    <option value="Femoral Vein">Femoral Vein</option>
                                    <option value="Popliteal">Popliteal</option>
                                  </>
                                )}
                                {selectedSurgery === 'Heart Transplant' && (
                                  <>
                                    <option value="Aorta">Aorta</option>
                                    <option value="Pulmonary Artery">Pulmonary Artery</option>
                                    <option value="Superior Vena Cava">Superior Vena Cava</option>
                                    <option value="Inferior Vena Cava">Inferior Vena Cava</option>
                                  </>
                                )}
                                {selectedSurgery === 'Carotid Endarterectomy' && (
                                  <>
                                    <option value="Common Carotid">Common Carotid</option>
                                    <option value="Internal Carotid">Internal Carotid</option>
                                  </>
                                )}
                                {selectedSurgery === 'Congenital' && (
                                  <>
                                    <option value="Aorta">Aorta</option>
                                    <option value="Pulmonary Artery">Pulmonary Artery</option>
                                    <option value="SVC">SVC</option>
                                    <option value="IVC">IVC</option>
                                  </>
                                )}
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Target Flow (L/min)</label>
                              <input 
                                type="number" 
                                min="0.1"
                                max="15"
                                step="0.1"
                                placeholder="4.5" 
                                onKeyDown={handlePositiveNumberInput}
                                value={targetFlow}
                                onChange={(e) => setTargetFlow(e.target.value)}
                                className="w-full bg-slate-800 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-rose-500 outline-none" 
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <div 
                            className="relative group"
                            onMouseEnter={() => setShowDeltaPTooltip(true)}
                            onMouseLeave={() => setShowDeltaPTooltip(false)}
                          >
                            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 rounded-2xl border border-slate-700 cursor-help group-hover:border-rose-500/50 transition-colors">
                              <Zap size={14} className="text-amber-500" />
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Pressure Drop Analysis (ΔP)</span>
                              <ChevronDown size={12} className="ml-auto text-slate-600 group-hover:text-rose-500 group-hover:rotate-180 transition-transform" />
                            </div>

                            <AnimatePresence>
                              {showDeltaPTooltip && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  className="absolute bottom-full left-0 w-80 mb-4 z-50 pointer-events-none"
                                >
                                  <div className="bg-slate-900 border border-slate-700 p-5 rounded-3xl shadow-2xl overflow-hidden relative">
                                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500" />
                                    
                                    <div className="flex items-center justify-between mb-4">
                                      <h4 className="text-xs font-black uppercase text-white tracking-widest">Technical Analysis</h4>
                                      <span className="text-[10px] font-bold text-amber-500 px-2 py-0.5 bg-amber-500/10 rounded-full border border-amber-500/20">M-Line Dynamics</span>
                                    </div>

                                    <div className="space-y-4">
                                      <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                        <p className="text-[10px] font-black uppercase text-slate-500 mb-1 tracking-widest">Energy Transfer Efficiency</p>
                                        <p className="text-[11px] leading-relaxed text-slate-300">
                                          Total pressure drop (ΔP) across the cannula is a function of viscosity and M-line flow rate. Targets must remain <span className="text-white font-bold">≤ 100 mmHg</span> to minimize shear stress and mechanical hemolysis.
                                        </p>
                                      </div>

                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="p-2 border border-slate-800 rounded-xl">
                                          <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Occupancy</p>
                                          <p className="text-xs font-bold text-emerald-400">Optimal: &lt;60%</p>
                                        </div>
                                        <div className="p-2 border border-slate-800 rounded-xl">
                                          <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Flow Profile</p>
                                          <p className="text-xs font-bold text-blue-400">Laminar (Ideal)</p>
                                        </div>
                                      </div>

                                      <div className="space-y-2">
                                        <div className="flex justify-between text-[9px] font-black uppercase text-slate-500">
                                          <span>Laminar</span>
                                          <span>Turbulent Risk</span>
                                        </div>
                                        <div className="flex gap-1 h-1.5">
                                          {[...Array(20)].map((_, i) => (
                                            <div key={i} className={`flex-1 rounded-full ${i < 8 ? 'bg-emerald-500' : i < 15 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                                          ))}
                                        </div>
                                      </div>

                                      <div className="pt-2 border-t border-slate-800">
                                        <p className="text-[9px] text-slate-500 leading-relaxed italic">
                                          Formula: ΔP ∝ (Flow^n / Diameter^4). Increasing French size exponentially reduces resistance.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="absolute top-full left-8 w-4 h-4 bg-slate-900 border-r border-b border-slate-700 rotate-45 -translate-y-2 shadow-xl" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    ) : selectedTool === 'bfr' ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Cardiac Index (L/min/m²)</label>
                          <div className="flex gap-2">
                            {[2.0, 2.2, 2.4, 2.6].map(ci => (
                              <button
                                key={ci}
                                onClick={() => setCardiacIndex(ci.toString())}
                                className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${
                                  cardiacIndex === ci.toString() 
                                  ? 'bg-rose-500 border-rose-500 text-white shadow-lg' 
                                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                }`}
                              >
                                {ci.toFixed(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Custom Index</label>
                          <input 
                            type="number" 
                            min="0.5"
                            max="5.0"
                            step="0.1"
                            placeholder="2.4" 
                            onKeyDown={handlePositiveNumberInput}
                            value={cardiacIndex}
                            onChange={(e) => setCardiacIndex(e.target.value)}
                            className="w-full bg-slate-800 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-rose-500 outline-none" 
                          />
                        </div>
                      </div>
                    ) : selectedTool === 'abg' ? (
                      <div className="space-y-6">
                        {/* Acid-Base & Respiratory */}
                        <div>
                          <p className="text-[9px] font-black uppercase text-slate-500 mb-3 tracking-[0.2em]">Gas Profile</p>
                          <div className="grid grid-cols-4 gap-2">
                            <ABGInput label="pH" value={abgPh} onChange={setAbgPh} min="6.5" max="8.0" step="0.01" />
                            <ABGInput label="pCO2" value={abgPco2} onChange={setAbgPco2} min="10" max="150" />
                            <ABGInput label="pO2" value={abgPo2} onChange={setAbgPo2} min="10" max="700" />
                            <ABGInput label="HCO3" value={abgHco3} onChange={setAbgHco3} min="5" max="60" />
                            <ABGInput label="BE" value={abgBe} onChange={setAbgBe} min="-30" max="30" />
                            <ABGInput label="Sat O2" value={abgSao2} onChange={setAbgSao2} min="0" max="100" />
                            <ABGInput label="FiO2 %" value={abgFio2} onChange={setAbgFio2} min="21" max="100" />
                            <ABGInput label="TCO2" value={abgTco2} onChange={setAbgTco2} min="5" max="60" />
                          </div>
                        </div>

                        {/* Electrolytes & Metabolites */}
                        <div className="pt-2">
                          <p className="text-[9px] font-black uppercase text-slate-500 mb-3 tracking-[0.2em]">Clinical Panel</p>
                          <div className="grid grid-cols-4 gap-2">
                            <ABGInput label="K+" value={abgK} onChange={setAbgK} min="1.0" max="10.0" step="0.1" />
                            <ABGInput label="Na+" value={abgNa} onChange={setAbgNa} min="100" max="180" />
                            <ABGInput label="Ca++" value={abgCa} onChange={setAbgCa} min="0.2" max="3.0" step="0.01" />
                            <ABGInput label="Gluc" value={abgGlucose} onChange={setAbgGlucose} min="20" max="800" />
                            <ABGInput label="Lac" value={abgLactate} onChange={setAbgLactate} min="0.1" max="25" step="0.1" />
                            <ABGInput label="Hct %" value={abgHct} onChange={setAbgHct} min="5" max="75" />
                            <ABGInput label="Hb" value={abgHb} onChange={setAbgHb} min="2" max="25" step="0.1" />
                            <ABGInput label="Temp °C" value={abgTemp} onChange={setAbgTemp} min="10" max="45" step="0.1" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                        <p className="text-[10px] text-slate-500 uppercase font-black">Tool Parameters Loading...</p>
                      </div>
                    )}
                  </div>
                  <button className="w-full bg-rose-600 hover:bg-rose-700 py-4 rounded-xl font-bold transition-all shadow-lg shadow-rose-900/40">
                    Calculate Result
                  </button>
                </div>
              </div>
              
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 flex flex-col justify-center">
                <div className="text-center space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Calculated Output</p>
                  <p className="text-6xl font-black text-rose-500 tracking-tighter">
                    {result ? (
                      <>
                        {result.value}
                        <span className="text-xl ml-1 text-slate-400 font-bold uppercase">{result.unit}</span>
                      </>
                    ) : (
                      '--.--'
                    )}
                  </p>
                  <p className="text-sm text-slate-400">
                    {result?.secondary ? result.secondary : result ? 'Calculation verified based on current inputs.' : 'Please provide all input parameters for analysis.'}
                  </p>
                  
                  {selectedTool === 'blood' && result && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-left"
                    >
                      <p className="text-[10px] font-black uppercase text-rose-400 mb-2 tracking-widest">Compatibility Matrix</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Provides To</p>
                          <div className="flex flex-wrap gap-1">
                            {getProvidesTo(bloodType, rhFactor).map(t => (
                              <span key={t} className="px-2 py-0.5 bg-rose-500/20 rounded text-[10px] font-bold text-rose-200">{t}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Receives From</p>
                          <div className="flex flex-wrap gap-1">
                            {getReceivesFrom(bloodType, rhFactor).map(t => (
                              <span key={t} className="px-2 py-0.5 bg-emerald-500/20 rounded text-[10px] font-bold text-emerald-200">{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
                <div className="mt-8 pt-8 border-t border-slate-700/50">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                      Disclaimer: These calculations are for clinical guidance only. Always verify results against manual clinical protocols and institutional policies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Background elements */}
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl opacity-50" />
            <div className="absolute -left-16 -top-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-50" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getProvidesTo(type: string, rh: string) {
  const full = `${type}${rh}`;
  const matrix: Record<string, string[]> = {
    'A+': ['A+', 'AB+'],
    'A-': ['A+', 'A-', 'AB+', 'AB-'],
    'B+': ['B+', 'AB+'],
    'B-': ['B+', 'B-', 'AB+', 'AB-'],
    'AB+': ['AB+'],
    'AB-': ['AB+', 'AB-'],
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  };
  return matrix[full] || [];
}

function getReceivesFrom(type: string, rh: string) {
  const full = `${type}${rh}`;
  const matrix: Record<string, string[]> = {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-']
  };
  return matrix[full] || [];
}
