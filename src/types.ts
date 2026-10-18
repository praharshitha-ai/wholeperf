export type ViewType = 'grand' | 'calculator' | 'inventory' | 'logs' | 'advanced' | 'dual' | 'profile';
export type UserRole = 'perfusionist' | 'surgeon' | null;

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  weight: number;
  height: number;
  bsa: number;
  procedureDate: string;
  procedureType: string;
  surgeon: string;
  perfusionist: string;
  notes: string;
  postOpNotes: string;
  status: 'Pre-Op' | 'Intra-Op' | 'Post-Op' | 'Discharged';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Oxygenators' | 'Tubing Kits' | 'Cannulae' | 'Medication' | 'Filters';
  stock: number;
  unit: string;
  minThreshold: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastSync: string;
}

export interface CalculatorResult {
  title: string;
  value: string;
  unit: string;
}
