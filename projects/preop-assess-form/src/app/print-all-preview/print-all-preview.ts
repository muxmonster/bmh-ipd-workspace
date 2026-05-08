import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { PreopForm } from '../preop-form/preop-form';
import { SurgicalChecklist } from '../surgical-checklist/surgical-checklist';

@Component({
  selector: 'app-print-all-preview',
  imports: [RouterLink, PreopForm, SurgicalChecklist],
  templateUrl: './print-all-preview.html',
  styleUrl: './print-all-preview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrintAllPreview {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private readySections = signal(0);
  private hasAutoPrinted = signal(false);

  an = toSignal(this.route.paramMap.pipe(map((p) => p.get('an') ?? '')), {
    initialValue: '',
  });

  autoPrint = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('autoPrint') === '1')),
    { initialValue: false },
  );

  autoClose = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('autoClose') === '1')),
    { initialValue: false },
  );

  constructor() {
    const handleAfterPrint = () => {
      if (!this.autoClose()) return;

      setTimeout(() => {
        window.close();
      }, 100);
    };

    window.addEventListener('afterprint', handleAfterPrint);
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('afterprint', handleAfterPrint);
    });

    effect(() => {
      if (!this.autoPrint()) return;
      if (this.hasAutoPrinted()) return;
      if (this.readySections() < 2) return;

      this.hasAutoPrinted.set(true);
      setTimeout(() => {
        window.print();
      }, 150);
    });
  }

  onSectionReady(): void {
    this.readySections.update((count) => Math.min(count + 1, 2));
  }

  printPreview(): void {
    window.print();
  }
}
