import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { acceptedFormatValidator } from '../../validators/acceptedFormat';
import { JSONFormType } from '../../types/jsonFormType';

@Component({
  selector: 'rinha-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnInit {
  public jsonForm!: FormGroup<JSONFormType>;

  public nonNullableFormBuilder = inject(NonNullableFormBuilder);

  public ngOnInit(): void {
    this.jsonForm = this.nonNullableFormBuilder.group<JSONFormType>({
      file: this.nonNullableFormBuilder.control({ value: '', disabled: false }, { validators: [Validators.required, acceptedFormatValidator()] })
    })
  }

}
