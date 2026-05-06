import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Patient } from '../models/patient.model';

@Component({
  selector: 'app-patient-header',
  templateUrl: './patient-header.html',
  styleUrl: './patient-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientHeader {
  patient = input.required<Patient>();
}
