import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormGroup, NonNullableFormBuilder, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, of, takeUntil } from 'rxjs';
import { JsonError } from 'src/app/helper/jsonParser';
import { JsonServiceService } from '../../services/json-service.service';
import { JSONFormType } from '../../types/jsonFormType';
import { acceptedFormatValidator } from '../../validators/acceptedFormat';

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
        { validators: [acceptedFormatValidator()], asyncValidators: [this.jsonValidator()] }
      )
    });

  }
  ngOnDestroy(): void {
    this.ngDestroyed$.next(true);
    this.ngDestroyed$.complete();
  }

  public onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files?.[0];
    if(this.jsonForm.invalid) {
      return;
    }

    if (file && file.type === "application/json" && this.jsonForm.valid) {
      this.jsonForm.controls.file.updateValueAndValidity({ emitEvent: true });
      this.handleForm(file);
    }
  }

  private handleForm(file: File) {
    if (this.jsonForm.invalid) {
      return;
    }
    if (this.jsonForm.valid) {
      this.jsonForm.controls.file.updateValueAndValidity({ emitEvent: true });
      this.jsonService.processJsonUsingWorker(file)
        .pipe(takeUntil(this.ngDestroyed$))
        .subscribe({
          next: (data) => {
            this.jsonService.addData(data);
          },
          error: (error) => {
            console.error({ error: error });
            if (error instanceof JsonError) {

              this.jsonForm.controls.file.setErrors({ invalidJson: true });
            }
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
  private jsonValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      const file: File | null = control.value;

      if (!file) {
        return of(null);
      }

      if (file && file instanceof File) {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();

          fileReader.onload = () => {
            try {
              const textRead = fileReader.result as string;
              JSON.parse(textRead);
              resolve(null);
            } catch (e) {
              resolve({ invalidJson: true });
            }
          };

          fileReader.onerror = () => {
            resolve({ invalidJson: true });
          };

          fileReader.readAsText(file, "UTF-8");
        });
      }

      return of(null);
    }
  }

}
