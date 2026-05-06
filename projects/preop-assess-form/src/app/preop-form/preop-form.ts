import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { PatientService } from '../services/patient/patient.service';
import { PatientHeader } from '../patient-header/patient-header';

@Component({
  selector: 'app-preop-form',
  imports: [PatientHeader, ReactiveFormsModule, RouterLink],
  templateUrl: './preop-form.html',
  styleUrl: './preop-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreopForm {
  private route = inject(ActivatedRoute);
  private patientService = inject(PatientService);
  private fb = inject(FormBuilder);

  private an = toSignal(
    this.route.queryParamMap.pipe(map((p) => p.get('an') ?? '')),
    { initialValue: '' }
  );

  patient = computed(() => this.patientService.getByAn(this.an()));

  form: FormGroup = this.fb.group({
    // ส่วนหัวฟอร์ม
    surgeryDate: [''],
    diagnosis: [''],
    surgicalProcedure: [''],
    surgeon: [''],
    setDate: [''],
    setBy: [''],
    surgeryType: ['elective'],

    // รายการตรวจสอบก่อนผ่าตัด (เช้า บ่าย ดึก เช้า)
    markSite: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    bloodReservation: [''],
    bloodType: [''],
    icuReserve: ['none'], // 'got' | 'notGot' | 'notNeeded' | 'none'
    consentSigned: [false],
    witnessSigned: [false],
    bodyClean: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    bathShampoo: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    skinCondition: ['normal'], // 'normal' | 'abnormal'
    labCBC: [false],
    labUA: [false],
    labFBS: [false],
    labBUN: [false],
    labCr: [false],
    labHIV: [false],
    labElyte: [false],
    labLFT: [false],
    labHbsAg: [false],
    labCXR: [false],
    labEKG: [false],
    labCT: [false],
    labMRI: [false],
    labOther: [''],
    printFilm: [false],
    filmOtherHospital: [''],
    npoTime: [''],
    vaginalDouche: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    foleyInserted: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    ngTubeInserted: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    enema: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    others: [''],
    removeDentures: ['none'], // 'yes' | 'no' | 'none'
    wristBand: [false],
    voidBeforeOR: ['none'], // 'yes' | 'no' | 'none'
    equipmentToOR: [''],
    checker: [''],

    // ยาที่ให้ (5 รายการ)
    med1: this.fb.group({ name: [''], date: [''], time: [''], nurse: [''] }),
    med2: this.fb.group({ name: [''], date: [''], time: [''], nurse: [''] }),
    med3: this.fb.group({ name: [''], date: [''], time: [''], nurse: [''] }),
    med4: this.fb.group({ name: [''], date: [''], time: [''], nurse: [''] }),
    med5: this.fb.group({ name: [''], date: [''], time: [''], nurse: [''] }),

    // พยาบาลห้องผ่าตัด
    orIntro: [false],
    orORInstruction: [false],
    orExplainSurgery: [false],
    orAnswerQuestions: [false],
    orCheckConsent: [false],
    orCheckCleanliness: [false],
    orFractureTable: [false],
    orPositionSupine: [false],
    orPositionLateralLt: [false],
    orPositionLateralRt: [false],
    orPositionProne: [false],
    orPositionLithotomy: [false],
    orPositionOther: [''],
    orSpecialEquipment: [''],
    orConfirmPatient: [false],
    orWristBand: [false],
    orMedicalRecord: [false],
    orXray: [false],
    orCT: [false],
    orMRI: [false],
    orOtherItems: [''],
    orReceiver: [''],

    // วิสัญญีพยาบาล
    aneExplainMethod: [false],
    aneExplainCare: [false],
    aneHistoryAllergy: [false],
    aneAllergyNote: [''],
    aneMedUsed: [''],
    aneMedNote: [''],
    aneHistoryCardiac: [false],
    aneHistoryAsthma: [false],
    aneHistoryAllergicDisease: [false],
    aneHistoryKidney: [false],
    aneHistoryHT: [false],
    aneHistoryDM: [false],
    aneHistoryTB: [false],
    aneHistoryLiver: [false],
    aneHistoryOther: [''],
    aneSmoke: [false],
    aneDrink: [false],
    aneOtherHabit: [''],
    aneAsaClass: ['1'],
    aneAnesthesiaConcern: [''],
    aneMallampatiClass: ['1'],
    aneDentures: [false],
    anePlanGA: [false],
    anePlanSB: [false],
    anePlanIV: [false],
    anePlanOther: [''],
    aneLabCBC: [false],
    aneLabUA: [false],
    aneLabFBS: [false],
    aneLabBUN: [false],
    aneLabCr: [false],
    aneLabElyte: [false],
    aneLabLFT: [false],
    aneLabHbsAg: [false],
    aneLabCXR: [false],
    aneLabEKG: [false],
    aneLabOther: [''],
    aneVisitor: [''],
  });

  readonly surgeryTypes = [
    { value: 'elective', label: 'Elective' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'urgency', label: 'Urgency' },
  ];

  readonly asaClasses = ['1', '2', '3', '4', '5', 'E'];
  readonly mallampatiClasses = ['1', '2', '3', '4', '5'];
  readonly shiftGroups = [
    { key: 'morning1', label: 'เช้า' },
    { key: 'afternoon', label: 'บ่าย' },
    { key: 'night', label: 'ดึก' },
    { key: 'morning2', label: 'เช้า' },
  ];

  constructor() {
    const p = this.patient();
    if (p) {
      this.form.patchValue({
        surgeryDate: p.surgeryDate,
        diagnosis: p.diagnosis,
        surgicalProcedure: p.surgicalProcedure,
        surgeon: p.surgeon,
        setDate: p.setDate,
        setBy: p.setBy,
        surgeryType: p.surgeryType,
      });
    }
  }

  onSubmit(): void {
    console.log(this.form.value);
  }

  printForm(): void {
    window.print();
  }
}
