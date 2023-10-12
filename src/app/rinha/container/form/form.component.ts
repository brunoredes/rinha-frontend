import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JsonServiceService } from '../../services/json-service.service';
import { JSONFormType } from '../../types/jsonFormType';
import { acceptedFormatValidator } from '../../validators/acceptedFormat';

@Component({
  selector: 'rinha-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnInit {
  public jsonForm!: FormGroup<JSONFormType>;
  @ViewChild('label', { static: true }) private labelButton!: HTMLLabelElement;

  public nonNullableFormBuilder = inject(NonNullableFormBuilder);
  private jsonService = inject(JsonServiceService);
  private router = inject(Router);

  public ngOnInit(): void {
    this.jsonForm = this.nonNullableFormBuilder.group<JSONFormType>({
      file: this.nonNullableFormBuilder.control({ value: '', disabled: false }, { validators: [Validators.required, acceptedFormatValidator()] })
    });
  }

  public onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (file && file.type === "application/json") {
      this.jsonService.processJsonStream(file)
        .subscribe({
          next: (data) => {
            this.jsonService.addData(data);
          },
          error: (error) => {
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

  public click() {
    this.labelButton.click();
  }
}
