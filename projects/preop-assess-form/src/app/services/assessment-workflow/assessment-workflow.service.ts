import { Injectable, inject } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap, throwError } from 'rxjs';
import { AssessmentDraftService } from '../assessment-draft/assessment-draft.service';
import { PatientService } from '../patient/patient.service';
import { PreopService } from '../preop/preop.service';
import { SurgicalChecklistService } from '../surgical-checklist/surgical-checklist.service';

@Injectable({ providedIn: 'root' })
export class AssessmentWorkflowService {
  private preopService = inject(PreopService);
  private checklistService = inject(SurgicalChecklistService);
  private patientService = inject(PatientService);
  private draftService = inject(AssessmentDraftService);

  saveAll(
    an: string,
    hn?: string,
    preopFormValue?: Record<string, unknown>,
    checklistFormValue?: Record<string, unknown>,
  ): Observable<void> {
    if (!an) {
      return throwError(() => new Error('Missing AN'));
    }

    return forkJoin({
      preopRecord: this.preopService.getLatest(an),
      checklistRecord: this.checklistService.getLatest(an),
    }).pipe(
      switchMap(({ preopRecord, checklistRecord }) => {
        const effectivePreopValue =
          preopFormValue ??
          this.draftService.getPreopDraft(an) ??
          (preopRecord ? this.preopService.toFormValue(preopRecord) : {});

        const effectiveChecklistValue =
          checklistFormValue ??
          this.draftService.getChecklistDraft(an) ??
          (checklistRecord ? this.checklistService.toFormValue(checklistRecord) : {});

        const preopRequest$ = preopRecord
          ? this.preopService.update(preopRecord.id, an, effectivePreopValue)
          : this.resolveHn(an, hn).pipe(
              switchMap((resolvedHn) => {
                if (!resolvedHn) {
                  return throwError(() => new Error('Cannot resolve HN for preop record creation'));
                }
                return this.preopService.create(an, resolvedHn, effectivePreopValue).pipe(map(() => void 0));
              }),
            );

        const checklistRequest$ = checklistRecord
          ? this.checklistService.update(checklistRecord.id, an, effectiveChecklistValue)
          : this.checklistService.create(an, effectiveChecklistValue).pipe(map(() => void 0));

        return forkJoin([preopRequest$, checklistRequest$]).pipe(map(() => void 0));
      }),
    );
  }

  private resolveHn(an: string, hn?: string): Observable<string> {
    if (hn && hn.trim()) {
      return of(hn.trim());
    }

    return this.patientService.getByAn(an).pipe(map((patient) => patient?.hn ?? ''));
  }
}
