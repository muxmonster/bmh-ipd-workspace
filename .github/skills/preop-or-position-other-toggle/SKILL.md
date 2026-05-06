---
name: preop-or-position-other-toggle
description: "Pattern for adding checkbox-driven enabled/disabled behavior to OR nurse 'ท่าผ่าตัด -> อื่นๆ' field in preop-assess-form. Covers Reactive Form model, template markup, and valueChanges wiring."
---

# OR Position Other Toggle Pattern

## When to Use
- Need a checkbox in front of "อื่นๆ" under "พยาบาลห้องผ่าตัด -> ท่าผ่าตัด"
- Need the "อื่นๆ" text input to be enabled only when the checkbox is checked
- Need a reusable Reactive Forms pattern for checkbox-controlled text fields

## Pattern

### FormGroup Model (TypeScript)
Create a dedicated boolean control for the checkbox and initialize the text control as disabled.

```typescript
orPositionOtherChecked: [false],
orPositionOther: [{ value: '', disabled: true }],
```

### Constructor Wiring (TypeScript)
Subscribe to the checkbox control and toggle input enable/disable with `emitEvent: false`.

```typescript
const orPositionOtherCheckedControl = this.form.get('orPositionOtherChecked');
const orPositionOtherControl = this.form.get('orPositionOther');

orPositionOtherCheckedControl?.valueChanges
  .pipe(startWith(orPositionOtherCheckedControl.value), takeUntilDestroyed())
  .subscribe((isChecked) => {
    if (isChecked) {
      orPositionOtherControl?.enable({ emitEvent: false });
      return;
    }

    orPositionOtherControl?.disable({ emitEvent: false });
  });
```

### HTML Template
Render a checkbox before the label text "อื่นๆ" and bind it to `orPositionOtherChecked`.

```html
<div class="text-row">
  <label class="checkbox-label" for="orPositionOtherChecked">
    <input id="orPositionOtherChecked" type="checkbox" formControlName="orPositionOtherChecked" />
    อื่นๆ
  </label>
  <input id="orPositionOther" type="text" formControlName="orPositionOther" class="inline-input" />
</div>
```

## Notes
- Do not use `[disabled]` in template for Reactive Forms controls.
- Use `.enable()` / `.disable()` in TypeScript to keep state consistent.
- Reuse this pattern for any "checkbox + details" field in the same form.

## Related Field Example
The same wiring pattern is used for "การเตรียมอุปกรณ์พิเศษ -> ระบุ".

```typescript
orSpecialEquipmentChecked: [false],
orSpecialEquipment: [{ value: '', disabled: true }],
```

```html
<label class="checkbox-label" for="orSpecialEquipmentChecked">
  <input id="orSpecialEquipmentChecked" type="checkbox" formControlName="orSpecialEquipmentChecked" />
  ระบุ
</label>
<input id="orSpecialEquipment" type="text" formControlName="orSpecialEquipment" class="inline-input" />
```
