import { Component, computed, signal } from '@angular/core';

interface INosoBasicInfo {
  hn: string;
  an: string;
  fullName: string;
  age: number;
  gender: string;
  wardname: string;
  admit_from: string;
  admit_date: Date | string;
  refer_from: string;
  refer_date: Date | string;
  init_symptom: string;
  init_infect_symptom: boolean;
  organ: string;
  germ: string;
  init_dx: string;
  comorbidity: string;
  discharge_dx: string;
  chronic_disease: string;
}

type Activity = {
  id: string;
  name: string;
};

@Component({
  selector: 'app-noso-page01',
  imports: [],
  templateUrl: './noso-page01.html',
  styleUrl: './noso-page01.scss',
})
export class NosoPage01 {
  pt: INosoBasicInfo = {
    hn: '67012345',
    an: 'AN256801234',
    fullName: 'นายสมชาย ใจดี',
    age: 67,
    gender: 'ชาย',
    wardname: 'อายุรกรรมชาย',
    admit_from: 'OPD',
    admit_date: '2025-01-18',
    refer_from: 'โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านหมี่',
    refer_date: '2025-01-17',
    init_symptom: 'ไข้สูง ไอ มีเสมหะ หายใจเหนื่อย',
    init_infect_symptom: true,
    organ: 'ระบบทางเดินหายใจ',
    germ: 'Klebsiella pneumoniae',
    init_dx: 'CXR พบ infiltration ที่ RLL, WBC สูง',
    comorbidity: 'เบาหวาน, ความดันโลหิตสูง',
    discharge_dx: 'Pneumonia with sepsis',
    chronic_disease: 'Diabetes Mellitus, Hypertension',
  };

   readonly days = signal<number[]>(Array.from({ length: 31 }, (_, i) => i + 1));
    readonly activities = signal<Activity[]>([
    { id: 'hand-hygiene', name: 'ล้างมือ 5 Moments' },
    { id: 'bed-clean', name: 'ทำความสะอาดเตียง/อุปกรณ์' },
    { id: 'ppe', name: 'สวม PPE ตามแนวทาง' },
  ]);
 // เก็บสถานะ: activityId -> Set ของวันที่ที่ติ๊กแล้ว
  readonly checked = signal<Record<string, Set<number>>>({});

  isChecked(activityId: string, day: number): boolean {
    return this.checked()[activityId]?.has(day) ?? false;
  }

  toggle(activityId: string, day: number, ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const next = structuredClone(this.checked()); // clone object (Set จะยังเป็น reference เดิม)
    const set = new Set(next[activityId] ?? []);

    if (input.checked) set.add(day);
    else set.delete(day);

    next[activityId] = set;
    this.checked.set(next);
  }

  // ไว้ดูผลรวมแบบเร็ว ๆ
  readonly summary = computed(() => {
    const obj = this.checked();
    const out: string[] = [];
    for (const [k, set] of Object.entries(obj)) {
      out.push(`${k}:${set.size}`);
    }
    return out.join(' | ') || '-';
  });
}