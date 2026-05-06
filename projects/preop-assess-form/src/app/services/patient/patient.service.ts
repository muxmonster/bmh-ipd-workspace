import { Injectable, signal } from '@angular/core';
import { Patient } from '../../models/patient.model';

const MOCK_PATIENTS: Patient[] = [
  {
    an: '690001111',
    hn: '67-12345',
    fullName: 'นายสมชาย ใจดี',
    age: 45,
    ward: 'Ward 3',
    surgeryDate: '06/05/2569',
    diagnosis: 'Appendicitis',
    surgicalProcedure: 'Appendectomy',
    surgeon: 'นพ.วิชัย รักษาดี',
    surgeryType: 'emergency',
    setDate: '05/05/2569',
    setBy: 'พญ.สุภา มีสุข',
  },
  {
    an: '690002222',
    hn: '65-98765',
    fullName: 'นางสาวมาลี สวยงาม',
    age: 32,
    ward: 'Ward 5',
    surgeryDate: '07/05/2569',
    diagnosis: 'Cholelithiasis',
    surgicalProcedure: 'Laparoscopic Cholecystectomy',
    surgeon: 'นพ.ประสิทธิ์ หมอดี',
    surgeryType: 'elective',
    setDate: '01/05/2569',
    setBy: 'พญ.สุภา มีสุข',
  },
  {
    an: '690003333',
    hn: '66-55555',
    fullName: 'นายประยุทธ์ แข็งแรง',
    age: 60,
    ward: 'ICU',
    surgeryDate: '06/05/2569',
    diagnosis: 'Femur Fracture',
    surgicalProcedure: 'ORIF Femur',
    surgeon: 'นพ.อนุชา กระดูกดี',
    surgeryType: 'urgency',
    setDate: '05/05/2569',
    setBy: 'นพ.อนุชา กระดูกดี',
  },
];

@Injectable({ providedIn: 'root' })
export class PatientService {
  private patients = signal<Patient[]>(MOCK_PATIENTS);

  getByAn(an: string): Patient | undefined {
    return this.patients().find((p) => p.an === an);
  }
}
