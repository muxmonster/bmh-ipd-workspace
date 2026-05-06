---
name: preop-med-datetime
description: 'Pattern for date/time fields in Angular Reactive Forms table rows. Use when adding a datepicker (input type=date) and split hour/minute selects (HH and mm) to form table rows. Covers FormGroup model changes, HTML template changes, and SCSS flex layout for the time cell.'
---

# Preop Med Date/Time Field Pattern

## When to Use
- Adding or converting date+time fields in Angular Reactive Forms grid/table rows
- Replacing plain text inputs with `<input type="date">` (datepicker) and split `<select>` hour/minute dropdowns

## Pattern

### FormGroup Model (TypeScript)
Each row group must have `date`, `timeHour`, and `timeMinute` (not a single `time` string):

```typescript
med1: this.fb.group({ name: [''], date: [''], timeHour: [''], timeMinute: [''], nurse: [''] }),
```

Reuse existing hour/minute arrays (already defined as `npoHours` and `npoMinutes`):

```typescript
readonly npoHours   = ['', ...Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))];
readonly npoMinutes = ['', ...Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))];
```

### HTML Template
```html
<input type="date" formControlName="date" class="med-col med-date" [attr.aria-label]="'วันที่ ' + i" />
<div class="med-time med-col">
  <select formControlName="timeHour" [attr.aria-label]="'ชั่วโมง ' + i" class="med-time-select">
    @for (h of npoHours; track h) {
      <option [value]="h">{{h}}</option>
    }
  </select>
  <span class="med-time-sep">:</span>
  <select formControlName="timeMinute" [attr.aria-label]="'นาที ' + i" class="med-time-select">
    @for (m of npoMinutes; track m) {
      <option [value]="m">{{m}}</option>
    }
  </select>
</div>
```

### SCSS
The time cell uses flexbox so both selects share the column width:

```scss
.med-time {
  display: flex;
  align-items: center;
  gap: 2px;

  .med-time-select {
    flex: 1;
    min-width: 0;
  }

  .med-time-sep {
    font-size: 0.78rem;
    line-height: 1;
  }
}

.med-date {
  width: 100%;
  font-size: 0.72rem;
}
```

## Notes
- `npoHours` and `npoMinutes` are defined once and shared between NPO time selects and med time selects.
- Do NOT use `[disabled]` binding in templates — use `{value:'', disabled:true}` in FormControl init or `.enable()`/`.disable()` in code.
- Grid column for the time cell (`1fr`) stays the same; flexbox inside handles the two selects.
