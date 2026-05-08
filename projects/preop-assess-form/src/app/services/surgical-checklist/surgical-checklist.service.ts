import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface SurgicalChecklistRecord {
  id: number;
  an: string;
  [key: string]: unknown;
}

function camelToSnake(key: string): string {
  return key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
}

function snakeToCamel(key: string): string {
  return key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

@Injectable({ providedIn: 'root' })
export class SurgicalChecklistService {
  private http = inject(HttpClient);

  getLatest(an: string): Observable<SurgicalChecklistRecord | null> {
    if (!an) return of(null);
    return this.http
      .get<{ success: boolean; data: SurgicalChecklistRecord }>(`/api/surgical-checklist/an/${an}`)
      .pipe(
        map((res) => res.data),
        catchError(() => of(null)),
      );
  }

  create(an: string, formValue: Record<string, unknown>): Observable<{ id: number }> {
    const payload = this.toApiPayload(an, formValue);
    return this.http
      .post<{ success: boolean; data: { id: number } }>('/api/surgical-checklist', payload)
      .pipe(map((res) => res.data));
  }

  update(id: number, an: string, formValue: Record<string, unknown>): Observable<void> {
    const payload = this.toApiPayload(an, formValue);
    return this.http.put<void>(`/api/surgical-checklist/${id}`, payload);
  }

  toFormValue(record: SurgicalChecklistRecord): Record<string, unknown> {
    const formValue: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(record)) {
      if (key === 'id' || key === 'an' || key === 'created_at' || key === 'updated_at' || key === 'created_by' || key === 'updated_by' || key === 'is_deleted' || key === 'preop_assessment_id') {
        continue;
      }
      formValue[snakeToCamel(key)] = value;
    }

    return formValue;
  }

  private toApiPayload(an: string, formValue: Record<string, unknown>): Record<string, unknown> {
    const payload: Record<string, unknown> = { an };

    for (const [key, value] of Object.entries(formValue)) {
      payload[camelToSnake(key)] = value;
    }

    return payload;
  }
}
