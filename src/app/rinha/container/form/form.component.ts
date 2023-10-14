import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JsonServiceService } from '../../services/json-service.service';
import { JSONFormType } from '../../types/jsonFormType';
import { acceptedFormatValidator } from '../../validators/acceptedFormat';
import { jsonValidator } from '../../validators/jsonValidator';
import { JsonError, jsonParser } from 'src/app/helper/jsonParser';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'rinha-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnInit, OnDestroy {
  public jsonForm!: FormGroup<JSONFormType>;

  public nonNullableFormBuilder = inject(NonNullableFormBuilder);
  private jsonService = inject(JsonServiceService);
  private router = inject(Router);
  private ngDestroyed$ = new Subject();

  public ngOnInit(): void {
    this.jsonForm = this.nonNullableFormBuilder.group<JSONFormType>({
      file: this.nonNullableFormBuilder.control(
        { value: '', disabled: false },
        { validators: [Validators.required, acceptedFormatValidator()], asyncValidators: [jsonValidator] }
      )
    });

  }
  ngOnDestroy(): void {
    this.ngDestroyed$.next(true);
    this.ngDestroyed$.complete();
  }
  public onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    console.log(this.jsonForm.controls.file.status);
    if (this.jsonForm.invalid) {
      this.jsonForm.controls.file.setErrors({ invalidJson: true });
      return;
    }
    if (file && file.type === "application/json" && this.jsonForm.valid) {
      // this.jsonForm.controls.file.setValue(file.name.toString());
      this.jsonForm.controls.file.updateValueAndValidity({ emitEvent: true });
      this.jsonService.processJsonStream(file)
        .pipe(takeUntil(this.ngDestroyed$))
        .subscribe({
          next: (data) => {
            this.jsonService.addData(data);
          },
          error: (error) => {
            console.error({ observableError: error });
            this.jsonForm.controls.file.setErrors({ invalidJson: true });
          },
          complete: () => {
            const fileName = file.name.split('.').slice(0, -1).join('.');
            this.router.navigate([fileName]);
          }
        }
        );
    }
  }


}
