import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AbstractControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationError } from 'ajv';
import { Subject, takeUntil } from 'rxjs';
import { JsonServiceService } from '../../services/json-service.service';
import { JSONFormType } from '../../types/jsonFormType';
import { jsonValidator } from '../../validators/jsonValidator';
import { JsonError } from 'src/app/helper/jsonParser';

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
        { validators: [this.jsonValidator] }
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

    if (file && file.type === "application/json" && this.jsonForm.valid) {
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
          },
          complete: () => {
            const fileName = file.name.split('.').slice(0, -1).join('.');
            this.router.navigate([fileName]);
          }
        }
        );
    }
  }

  private handleForm() {
    if (this.jsonForm.invalid) {
      return;
    }
    if (this.jsonForm.valid) {
      this.jsonForm.controls.file.updateValueAndValidity({ emitEvent: true });
    }
  }
  private jsonValidator(control: AbstractControl): { [key: string]: any } | null {
    const file: File | null = control.value;
    if(!file) {
      return null;
    }
    if (file && file instanceof File) {
      const fileReader = new FileReader();
      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = () => {
        try {
          const textRead = fileReader.result as string;
          JSON.parse(textRead.trim());
          return null;
        } catch (e) {
          return { invalidJson: true }
        }
      };
      fileReader.onerror = () => {
        return { invalidJson: true };
      };
    }
    return null;
  }

}
