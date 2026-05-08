import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { AssessmentDraftService } from '../services/assessment-draft/assessment-draft.service';
import { AssessmentWorkflowService } from '../services/assessment-workflow/assessment-workflow.service';
import { PatientService } from '../services/patient/patient.service';
import { SurgicalChecklistService } from '../services/surgical-checklist/surgical-checklist.service';
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
  private surgicalChecklistService = inject(SurgicalChecklistService);
  private draftService = inject(AssessmentDraftService);
  private workflowService = inject(AssessmentWorkflowService);
  private fb = inject(FormBuilder);
  private savedRecordId = signal<number | null>(null);

  anOverride = input('');
  printModeInput = input<boolean | null>(null);
  ready = output<void>();

  private routeAn = toSignal(this.route.paramMap.pipe(map((p) => p.get('an') ?? '')), {
    initialValue: '',
  });

  an = computed(() => this.anOverride() || this.routeAn());

  private routePrintMode = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('printMode') === '1')),
    { initialValue: false },
  );

  printMode = computed(() => this.printModeInput() ?? this.routePrintMode());

  patient = toSignal(
    toObservable(this.an).pipe(
      switchMap((an) => this.patientService.getByAn(an)),
    ),
    { initialValue: null },
  );

  checklistRecord = toSignal(
    toObservable(this.an).pipe(
      switchMap((an) => this.surgicalChecklistService.getLatest(an)),
    ),
    { initialValue: null },
  );

  private formReady = signal(false);
  private readySent = signal(false);

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

  constructor() {
    effect(() => {
      const an = this.an();
      if (!an) {
        this.formReady.set(false);
        return;
      }

      const record = this.checklistRecord();
      const draftValue = an ? this.draftService.getChecklistDraft(an) : null;
      this.formReady.set(false);

      if (record) {
        this.savedRecordId.set(record.id);
        this.form.patchValue(this.surgicalChecklistService.toFormValue(record));
      } else {
        this.savedRecordId.set(null);
      }

      if (draftValue) {
        this.form.patchValue(draftValue);
      }

      this.formReady.set(true);
    });

    effect(() => {
      if (this.readySent()) return;
      if (!this.patient()) return;
      if (!this.formReady()) return;

      this.readySent.set(true);
      this.ready.emit();
    });

    this.form.valueChanges
      .pipe(debounceTime(120), takeUntilDestroyed())
      .subscribe(() => {
        const activeAn = this.an();
        if (!activeAn) return;
        this.draftService.saveChecklistDraft(activeAn, this.form.getRawValue() as Record<string, unknown>);
      });
  }

  onSubmit(): void {
    const patient = this.patient();
    if (!patient) return;

    const an = patient.an;
    const formValue = this.form.getRawValue() as Record<string, unknown>;
    const id = this.savedRecordId();

    if (id !== null) {
      this.surgicalChecklistService.update(id, an, formValue).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'บันทึกสำเร็จ',
            text: 'อัปเดตข้อมูล Surgical Checklist เรียบร้อยแล้ว',
            timer: 2000,
            showConfirmButton: false,
          });
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
          });
        },
      });
    } else {
      this.surgicalChecklistService.create(an, formValue).subscribe({
        next: ({ id: newId }) => {
          this.savedRecordId.set(newId);
          Swal.fire({
            icon: 'success',
            title: 'บันทึกสำเร็จ',
            text: 'สร้าง Surgical Checklist ใหม่เรียบร้อยแล้ว',
            timer: 2000,
            showConfirmButton: false,
          });
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
          });
        },
      });
    }
  }

  printForm(): void {
    window.print();
  }

  onSaveAll(): void {
    const patient = this.patient();
    if (!patient) return;

    const checklistValue = this.form.getRawValue() as Record<string, unknown>;
    this.workflowService.saveAll(patient.an, patient.hn, undefined, checklistValue).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'บันทึกรวมสำเร็จ',
          text: 'บันทึกข้อมูลทั้ง Step 1 และ Step 2 เรียบร้อยแล้ว',
          timer: 2000,
          showConfirmButton: false,
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถบันทึกรวมทุก Step ได้ กรุณาลองใหม่อีกครั้ง',
        });
      },
    });
  }

  onPrintAll(): void {
    const patient = this.patient();
    if (!patient) return;

    const printWindow = window.open('', '_blank', 'popup=yes,width=1200,height=900');
    if (!printWindow) {
      Swal.fire({
        icon: 'error',
        title: 'ไม่สามารถเปิดหน้าพิมพ์ได้',
        text: 'กรุณาอนุญาต popup ของเบราว์เซอร์แล้วลองใหม่อีกครั้ง',
      });
      return;
    }

    printWindow.document.write('<title>Preparing print...</title><p style="font-family:Sarabun,sans-serif;padding:16px;">กำลังเตรียมไฟล์พิมพ์รวม...</p>');
    printWindow.document.close();

    const checklistValue = this.form.getRawValue() as Record<string, unknown>;
    this.workflowService.saveAll(patient.an, patient.hn, undefined, checklistValue).subscribe({
      next: () => {
        printWindow.location.href = `/ipd/print-all-v2/${encodeURIComponent(patient.an)}?autoPrint=1&autoClose=1`;
      },
      error: () => {
        printWindow.close();
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถเตรียมข้อมูลสำหรับพิมพ์ PDF รวมได้',
        });
      },
    });
  }
}
