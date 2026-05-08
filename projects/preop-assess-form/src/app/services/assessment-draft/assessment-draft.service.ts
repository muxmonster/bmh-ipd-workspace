import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AssessmentDraftService {
  private readonly prefix = 'preop-assess-form:draft';

  savePreopDraft(an: string, value: Record<string, unknown>): void {
    this.save(this.buildKey(an, 'preop'), value);
  }

  getPreopDraft(an: string): Record<string, unknown> | null {
    return this.get(this.buildKey(an, 'preop'));
  }

  saveChecklistDraft(an: string, value: Record<string, unknown>): void {
    this.save(this.buildKey(an, 'checklist'), value);
  }

  getChecklistDraft(an: string): Record<string, unknown> | null {
    return this.get(this.buildKey(an, 'checklist'));
  }

  clearDrafts(an: string): void {
    localStorage.removeItem(this.buildKey(an, 'preop'));
    localStorage.removeItem(this.buildKey(an, 'checklist'));
  }

  private buildKey(an: string, section: 'preop' | 'checklist'): string {
    return `${this.prefix}:${an}:${section}`;
  }

  private save(key: string, value: Record<string, unknown>): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage errors to keep form usage uninterrupted.
    }
  }

  private get(key: string): Record<string, unknown> | null {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}
