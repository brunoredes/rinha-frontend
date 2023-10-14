import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JsonServiceService } from '../../services/json-service.service';
import { JSONFormType } from '../../types/jsonFormType';
import { acceptedFormatValidator } from '../../validators/acceptedFormat';
import { StreamJsonError } from '../../errors/streamJsonError';

@Component({
  selector: 'rinha-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnInit {
  public jsonForm!: FormGroup<JSONFormType>;

  public nonNullableFormBuilder = inject(NonNullableFormBuilder);
  private jsonService = inject(JsonServiceService);
  private router = inject(Router);
  private jsonData!: any;

  public ngOnInit(): void {
    this.jsonForm = this.nonNullableFormBuilder.group<JSONFormType>({
      file: this.nonNullableFormBuilder.control({ value: '', disabled: false }, { validators: [Validators.required, acceptedFormatValidator()] })
    });
  }

  public onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (file && file.type === "application/json") {
      this.jsonForm.controls.file.updateValueAndValidity({ emitEvent: true });
      this.jsonService.processJsonStream(file)
        .subscribe({
          next: (data) => {
            this.jsonService.addData(data);
          },
          error: (error) => {
            if (error && error instanceof StreamJsonError) {
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

      //const reader = new FileReader();
      //reader.onload = () => {
      //  try {
      //    this.jsonData = JSON.parse(reader.result as string);
      //    this.jsonService.setData(this.jsonData);
      //  } catch (e) {
      //    console.error('Invalid JSON file:', e);
      //  }
      //};
      //reader.readAsText(file);
      //
      //const fileName = file.name.split('.').slice(0, -1).join('.');
      //this.router.navigate([fileName]);
    }
  }

}
