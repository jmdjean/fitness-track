import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { type ValidationError } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BodyMetrics } from '../../signal-forms/validators';

@Component({
  selector: 'app-body-metrics',
  templateUrl: './body-metrics.component.html',
  styleUrls: ['./body-metrics.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: BodyMetricsComponent,
      multi: true,
    },
  ],
})
export class BodyMetricsComponent implements ControlValueAccessor, OnDestroy {
  @Input() errors: ReadonlyArray<ValidationError.WithOptionalField> = [];
  @Input() touched = false;

  readonly metricsForm: FormGroup = this.formBuilder.group({
    weightKg: [null],
    heightCm: [null],
  });

  private readonly destroy$ = new Subject<void>();
  private onChange: (value: BodyMetrics) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private readonly formBuilder: FormBuilder) {
    this.setForm();
  }

  writeValue(value: BodyMetrics | null): void {
    this.metricsForm.setValue(
      {
        weightKg: value?.weightKg ?? null,
        heightCm: value?.heightCm ?? null,
      },
      { emitEvent: false }
    );
  }

  registerOnChange(fn: (value: BodyMetrics) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.metricsForm.disable({ emitEvent: false });
      return;
    }

    this.metricsForm.enable({ emitEvent: false });
  }

  handleBlur(): void {
    this.onTouched();
  }

  hasError(kind: string): boolean {
    return this.errors.some((error) => error.kind === kind);
  }

  shouldShowError(): boolean {
    return this.touched;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setForm(): void {
    this.metricsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const weight =
          value.weightKg === '' || value.weightKg === null
            ? null
            : Number(value.weightKg);
        const height =
          value.heightCm === '' || value.heightCm === null
            ? null
            : Number(value.heightCm);
        this.onChange({
          weightKg: Number.isNaN(weight) ? null : weight,
          heightCm: Number.isNaN(height) ? null : height,
        });
      });
  }
}
