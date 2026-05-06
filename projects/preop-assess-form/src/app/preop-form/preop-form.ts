import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs/operators';
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
    bloodReservationShift: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    bloodReservation: [''],
    bloodType: [''],
    icuReserveShift: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    icuReserve: ['none'], // 'got' | 'notGot' | 'notNeeded' | 'none'
    consentShift: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    consentSigned: [false],
    witnessSigned: [false],
    bodyClean: this.fb.group({ checked: [false], morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    bathShampoo: this.fb.group({ checked: [false], morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    skinConditionShift: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    skinCondition: ['normal'], // 'prepared' | 'normal' | 'abnormal'
    labCBCShift: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    labCBC: [false],
    labUA: [false],
    labFBS: [false],
    labBUN: [false],
    labCr: [false],
    labHIV: [false],
    labElyteShift: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    labElyte: [false],
    labLFT: [false],
    labHbsAg: [false],
    labCXR: [false],
    labEKGShift: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    labEKG: [false],
    labCT: [false],
    labMRI: [false],
    labOtherShift: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    labOtherChecked: [false],
    labOther: [{ value: '', disabled: true }],
    printFilmShift: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    printFilm: [false],
    filmOtherHospitalShift: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    filmOtherHospitalChecked: [false],
    filmOtherHospital: [{ value: '', disabled: true }],
    npoShift: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    npoChecked: [false],
    npoHour: [{ value: '', disabled: true }],
    npoMinute: [{ value: '', disabled: true }],
    vaginalDouche: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    foleyInserted: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    ngTubeInserted: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    enema: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    othersChecked: [false],
    others: [{ value: '', disabled: true }],
    othersShift: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    removeDentures: ['none'], // 'yes' | 'no' | 'none'
    removeDenturesShift: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    wristBand: [false],
    wristBandShift: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    voidBeforeOR: ['none'], // 'yes' | 'no' | 'none'
    voidBeforeORShift: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    equipmentToOR: [''],
    equipmentToORShift: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    extraRow1: this.fb.group({ note: [''], morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    extraRow2: this.fb.group({ note: [''], morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    extraRow3: this.fb.group({ note: [''], morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    extraRow4: this.fb.group({ note: [''], morning1: [false], afternoon: [false], night: [false], morning2: [false] }),
    checker: [''],
    checkerShift: this.fb.group({ morning1: [false], afternoon: [false], night: [false], morning2: [false] }),

    // ยาที่ให้ (5 รายการ)
    med1: this.fb.group({ name: [''], date: [null], timeHour: [''], timeMinute: [''], nurse: [''] }),
    med2: this.fb.group({ name: [''], date: [null], timeHour: [''], timeMinute: [''], nurse: [''] }),
    med3: this.fb.group({ name: [''], date: [null], timeHour: [''], timeMinute: [''], nurse: [''] }),
    med4: this.fb.group({ name: [''], date: [null], timeHour: [''], timeMinute: [''], nurse: [''] }),
    med5: this.fb.group({ name: [''], date: [null], timeHour: [''], timeMinute: [''], nurse: [''] }),

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
    orPositionOtherChecked: [false],
    orPositionOther: [{ value: '', disabled: true }],
    orSpecialEquipmentChecked: [false],
    orSpecialEquipment: [{ value: '', disabled: true }],
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

  readonly npoHours = ['', ...Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))];
  readonly npoMinutes = ['', ...Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))];

  readonly asaClasses = ['1', '2', '3', '4', '5', 'E'];
  readonly mallampatiClasses = ['1', '2', '3', '4', '5'];
  readonly shiftGroups = [
    { key: 'morning1', label: 'เช้า' },
    { key: 'afternoon', label: 'บ่าย' },
    { key: 'night', label: 'ดึก' },
    { key: 'morning2', label: 'เช้า' },
  ];

  constructor() {
    const labOtherCheckedControl = this.form.get('labOtherChecked');
    const labOtherControl = this.form.get('labOther');
    const filmOtherHospitalCheckedControl = this.form.get('filmOtherHospitalChecked');
    const filmOtherHospitalControl = this.form.get('filmOtherHospital');
    const npoCheckedControl = this.form.get('npoChecked');
    const npoHourControl = this.form.get('npoHour');
    const npoMinuteControl = this.form.get('npoMinute');
    const othersCheckedControl = this.form.get('othersChecked');
    const othersControl = this.form.get('others');
    const orPositionOtherCheckedControl = this.form.get('orPositionOtherChecked');
    const orPositionOtherControl = this.form.get('orPositionOther');
    const orSpecialEquipmentCheckedControl = this.form.get('orSpecialEquipmentChecked');
    const orSpecialEquipmentControl = this.form.get('orSpecialEquipment');

    labOtherCheckedControl?.valueChanges
      .pipe(startWith(labOtherCheckedControl.value), takeUntilDestroyed())
      .subscribe((isChecked) => {
        if (isChecked) {
          labOtherControl?.enable({ emitEvent: false });
          return;
        }

        labOtherControl?.disable({ emitEvent: false });
      });

    filmOtherHospitalCheckedControl?.valueChanges
      .pipe(startWith(filmOtherHospitalCheckedControl.value), takeUntilDestroyed())
      .subscribe((isChecked) => {
        if (isChecked) {
          filmOtherHospitalControl?.enable({ emitEvent: false });
          return;
        }

        filmOtherHospitalControl?.disable({ emitEvent: false });
      });

    npoCheckedControl?.valueChanges
      .pipe(startWith(npoCheckedControl.value), takeUntilDestroyed())
      .subscribe((isChecked) => {
        const now = new Date();
        if (isChecked) {
          npoHourControl?.enable({ emitEvent: false });
          npoMinuteControl?.enable({ emitEvent: false });
          npoHourControl?.setValue(String(now.getHours()).padStart(2, '0'), { emitEvent: false });
          npoMinuteControl?.setValue(String(now.getMinutes()).padStart(2, '0'), { emitEvent: false });
          return;
        }

        npoHourControl?.setValue('', { emitEvent: false });
        npoMinuteControl?.setValue('', { emitEvent: false });
        npoHourControl?.disable({ emitEvent: false });
        npoMinuteControl?.disable({ emitEvent: false });
      });

    othersCheckedControl?.valueChanges
      .pipe(startWith(othersCheckedControl.value), takeUntilDestroyed())
      .subscribe((isChecked) => {
        if (isChecked) {
          othersControl?.enable({ emitEvent: false });
          return;
        }

        othersControl?.disable({ emitEvent: false });
      });

    orPositionOtherCheckedControl?.valueChanges
      .pipe(startWith(orPositionOtherCheckedControl.value), takeUntilDestroyed())
      .subscribe((isChecked) => {
        if (isChecked) {
          orPositionOtherControl?.enable({ emitEvent: false });
          return;
        }

        orPositionOtherControl?.disable({ emitEvent: false });
      });

    orSpecialEquipmentCheckedControl?.valueChanges
      .pipe(startWith(orSpecialEquipmentCheckedControl.value), takeUntilDestroyed())
      .subscribe((isChecked) => {
        if (isChecked) {
          orSpecialEquipmentControl?.enable({ emitEvent: false });
          return;
        }

        orSpecialEquipmentControl?.disable({ emitEvent: false });
      });

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
