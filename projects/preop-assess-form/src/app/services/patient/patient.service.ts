import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Patient } from '../../models/patient.model';

interface PatientApiResponse {
  success: boolean;
  data: {
    an: string;
    hn: string;
    fullName: string;
    age: number;
    ward: string;
    admitDate: string;
  };
}

@Injectable({ providedIn: 'root' })
export class PatientService {
  private http = inject(HttpClient);

  getByAn(an: string): Observable<Patient | null> {
    if (!an) return of(null);
    return this.http
      .get<PatientApiResponse>(`/api/patient/${an}`)
      .pipe(
        map((res) => res.data),
        catchError(() => of(null)),
      );
  }
}
