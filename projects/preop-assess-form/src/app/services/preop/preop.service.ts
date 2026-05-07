import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface PreopRecord {
  id: number;
  an: string;
  hn: string;
  surgeryDate: string | null;
  diagnosis: string | null;
  surgicalProcedure: string | null;
  surgeon: string | null;
  setDate: string | null;
  setBy: string | null;
  surgeryType: 'elective' | 'emergency' | 'urgency';
  checklistData: Record<string, unknown> | null;
  orNurseData: Record<string, unknown> | null;
  anesthesiaData: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Field-to-section mapping ──────────────────────────────────────────────────

const TOP_LEVEL_KEYS = new Set([
  'surgeryDate', 'diagnosis', 'surgicalProcedure', 'surgeon',
  'setDate', 'setBy', 'surgeryType',
]);

const OR_NURSE_KEYS = new Set([
  'orIntro', 'orORInstruction', 'orExplainSurgery', 'orAnswerQuestions',
  'orCheckConsent', 'orCheckCleanliness', 'orFractureTable',
  'orPositionSupine', 'orPositionLateralLt', 'orPositionLateralRt',
  'orPositionProne', 'orPositionLithotomy',
  'orPositionOtherChecked', 'orPositionOther',
  'orSpecialEquipmentChecked', 'orSpecialEquipment',
  'orConfirmPatient', 'orWristBand', 'orMedicalRecord',
  'orXray', 'orCT', 'orMRI',
  'orOtherItemsChecked', 'orOtherItems', 'orExtraItems', 'orReceiver',
]);

const ANE_KEYS = new Set([
  'aneExplainMethod', 'aneExplainCare', 'aneHistoryAllergy',
  'aneProblem', 'aneProblemBlank1', 'aneProblemBlank2',
  'aneAllergyChecked', 'aneAllergyNote',
  'aneMedUsed', 'aneMedNote',
  'aneHistoryCardiac', 'aneHistoryAsthma', 'aneHistoryAllergicDisease',
  'aneHistoryKidney', 'aneHistoryHT', 'aneHistoryDM', 'aneHistoryTB', 'aneHistoryLiver',
  'aneHistoryOtherChecked', 'aneHistoryOther',
  'aneSmoke', 'aneDrink', 'aneOtherHabitChecked', 'aneOtherHabit',
  'aneMedUsedChecked', 'aneMedUsedBlank',
  'aneAsaClass', 'aneAnesthesiaConcern', 'aneAnesthesiaConcernBlank',
  'aneMallampatiClass', 'aneDentures',
  'anePlanGA', 'anePlanSB', 'anePlanIV', 'anePlanOtherChecked', 'anePlanOther',
  'aneLabCBC', 'aneLabUA', 'aneLabFBS', 'aneLabBUN', 'aneLabCr', 'aneLabElyte',
  'aneLabLFT', 'aneLabHbsAg', 'aneLabCXR', 'aneLabEKG',
  'aneLabOtherChecked', 'aneLabOther', 'aneVisitor',
]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** แปลง ISO datetime string หรือ date-only string → "yyyy-MM-dd" สำหรับ <input type="date"> */
function toDateInputValue(value: string | null | undefined): string {
  if (!value) return '';
  // ตัด timezone suffix แล้วเอาแค่ส่วน date (10 ตัวแรก)
  return value.substring(0, 10);
}

// ─── Service ───────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class PreopService {
  private http = inject(HttpClient);

  /** ดึงแบบประเมินล่าสุดของผู้ป่วย — คืน null เมื่อไม่พบหรือมี error */
  getLatest(an: string): Observable<PreopRecord | null> {
    if (!an) return of(null);
    return this.http
      .get<{ success: boolean; data: PreopRecord }>(`/api/preop/an/${an}`)
      .pipe(
        map((res) => res.data),
        catchError(() => of(null)),
      );
  }

  /** สร้างแบบประเมินใหม่ — คืน id ที่ได้ */
  create(
    an: string,
    hn: string,
    formValue: Record<string, unknown>,
  ): Observable<{ id: number }> {
    const { topLevel, checklistData, orNurseData, anesthesiaData } =
      this.splitFormValue(formValue);
    return this.http
      .post<{ success: boolean; data: { id: number } }>('/api/preop', {
        an,
        hn,
        ...topLevel,
        checklistData,
        orNurseData,
        anesthesiaData,
      })
      .pipe(map((res) => res.data));
  }

  /** อัปเดตแบบประเมินที่มีอยู่ */
  update(
    id: number,
    an: string,
    formValue: Record<string, unknown>,
  ): Observable<void> {
    const { topLevel, checklistData, orNurseData, anesthesiaData } =
      this.splitFormValue(formValue);
    return this.http.put<void>(`/api/preop/${id}`, {
      an,
      ...topLevel,
      checklistData,
      orNurseData,
      anesthesiaData,
    });
  }

  /** Soft-delete แบบประเมิน */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/preop/${id}`);
  }

  /**
   * แปลง PreopRecord จาก backend กลับเป็น flat form value
   * เพื่อใช้กับ form.patchValue()
   */
  toFormValue(record: PreopRecord): Record<string, unknown> {
    return {
      surgeryDate: toDateInputValue(record.surgeryDate),
      diagnosis: record.diagnosis ?? '',
      surgicalProcedure: record.surgicalProcedure ?? '',
      surgeon: record.surgeon ?? '',
      setDate: toDateInputValue(record.setDate),
      setBy: record.setBy ?? '',
      surgeryType: record.surgeryType ?? 'elective',
      ...(record.checklistData ?? {}),
      ...(record.orNurseData ?? {}),
      ...(record.anesthesiaData ?? {}),
    };
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  private splitFormValue(v: Record<string, unknown>) {
    const topLevel: Record<string, unknown> = {};
    const checklistData: Record<string, unknown> = {};
    const orNurseData: Record<string, unknown> = {};
    const anesthesiaData: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(v)) {
      if (TOP_LEVEL_KEYS.has(key)) {
        topLevel[key] = value;
      } else if (OR_NURSE_KEYS.has(key)) {
        orNurseData[key] = value;
      } else if (ANE_KEYS.has(key)) {
        anesthesiaData[key] = value;
      } else {
        checklistData[key] = value;
      }
    }

    return { topLevel, checklistData, orNurseData, anesthesiaData };
  }
}
