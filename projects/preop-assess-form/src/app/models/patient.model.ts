export interface Patient {
  an: string;
  hn: string;
  fullName: string;
  age: number;
  ward: string;
  surgeryDate: string;
  diagnosis: string;
  surgicalProcedure: string;
  surgeon: string;
  surgeryType: 'elective' | 'emergency' | 'urgency';
  setDate: string;
  setBy: string;
}
