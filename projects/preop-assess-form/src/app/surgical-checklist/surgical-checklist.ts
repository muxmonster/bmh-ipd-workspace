import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { PatientService } from '../services/patient/patient.service';
import { PatientHeader } from '../patient-header/patient-header';

@Component({
  selector: 'app-surgical-checklist',
  imports: [PatientHeader, ReactiveFormsModule, RouterLink],
  templateUrl: './surgical-checklist.html',
  styleUrl: './surgical-checklist.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurgicalChecklist {
  private route = inject(ActivatedRoute);
  private patientService = inject(PatientService);
  private fb = inject(FormBuilder);

  patient = toSignal(
    this.route.paramMap.pipe(
      map((p) => p.get('an') ?? ''),

      switchMap((an) => this.patientService.getByAn(an)),
    ),
    { initialValue: null },
  );

  form: FormGroup = this.fb.group({
    // ===== SIGN IN =====
    // 1. ยืนยันตัวตน
    siIdentityConfirmed: ['done'],      // 'done' | 'notDone'
    // 2. ตำแหน่งผ่าตัด mark
    siSiteMarked: ['done'],             // 'done' | 'notDone' | 'na'
    // 3. Anaesthetic machine
    siAnaMachineReady: ['yes'],         // 'yes' | 'no'
    // 4. Pulse oximeter
    siPulseOxWorking: ['yes'],          // 'yes' | 'no'
    // 5.1 แพ้ยา/อาหาร
    siAllergyNone: [true],
    siAllergyNote: [''],
    // 5.2 ความเสี่ยงสูดสำลัก
    siAspirationRiskNone: [true],
    siAspirationRiskNote: [''],
    // 5.3 ความเสี่ยงเสียเลือด >500 ml
    siBloodLossRiskNone: [true],
    siBloodLossRiskNote: [''],

    // ===== TIME OUT =====
    // 1. สมาชิกทีมแนะนำตัว
    toTeamIntroduced: [false],
    // 2. ยืนยันชื่อ-สกุล, หัตถการ, ตำแหน่ง
    toPatientConfirmed: [false],
    // 3. ศัลยแพทย์
    toCriticalSteps: ['no'],            // 'yes' | 'no'
    toSpecialEquipment: ['no'],         // 'yes' | 'no'
    toDurationLt1h: [false],
    toDuration1to2h: [false],
    toDurationGt2h: [false],
    toExpectedBloodLoss: [''],
    // 3. วิสัญญีแพทย์
    toAneConcerns: [''],
    toAsaClass: ['1'],
    toSpecialMonitoring: ['no'],        // 'yes' | 'no'
    toSpecialMonitoringNote: [''],
    // 3. พยาบาล
    toSterileIndicatorConfirmed: [false],
    toNurseEquipmentConcernNone: [true],
    toNurseEquipmentConcernNote: [''],
    // 4. SSI prevention / Antibiotic
    toAntibioticGiven: ['given'],       // 'given' | 'notNeeded'
    toCoverPatient: [false],
    toShaveHair: [false],
    toGlucoseControl: [false],
    // 5. VTE Prophylaxis
    toVTEGiven: ['given'],              // 'given' | 'notGiven'
    // 6. Radiology
    toRadiologyNone: [true],
    toRadiologyNote: [''],

    // ===== SIGN OUT =====
    soProcedureName: [''],
    soInstrumentCountComplete: [false],
    soSpecimenLabeled: [false],
    soEquipmentIssueNote: [''],
    soRecoveryNote: [''],

    // ลงนาม
    signSurgeon: [''],
    signOrNurse: [''],
    signAnesthesia: [''],
  });

  onSubmit(): void {
    console.log(this.form.value);
  }

  printForm(): void {
    window.print();
  }
}
