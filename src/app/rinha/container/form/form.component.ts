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

    new ReadableStream()
      .pipeThrough(new TextDecoderStream())
      .pipeTo(
        new WritableStream({
          write(chunk) {
            console.log(chunk);
          }
        })
      ).then(() => console.log('aqui'))
  }


  // public onFileChange(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   const files = input.files;
  //   if (files && files[0]) {
  //     const file = files[0];
  //     const writable = new WritableStream({
  //       write(json) {

  //       }
  //     });
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       try {
  //         const jsonData = JSON.parse(e.target?.result as string);

  //         if (this.jsonService.isValidJson(jsonData)) {
  //           // Here we consume the JSON using streams.
  //             let stream;
  //           this.jsonService.getNDJSONData().subscribe({
  //             next: (data) => {
  //               console.log(data);
  //               this.jsonService.setJsonData(data);
  //             }
  //           }
  //           )

  //           //Pass the stream to the component responsible for rendering.
  //             this.jsonStreamToComponent('aaaaa');

  //           const fileNameWithoutExtension = input?.files?.[0].name.split('.').slice(0, -1).join('.');
  //           this.router.navigate([fileNameWithoutExtension]);
  //         } else {
  //           this.jsonForm.controls.file.setErrors({ readError: true });
  //         }
  //       } catch (err) {
  //         this.jsonForm.controls.file.setErrors({ readError: true });
  //       }
  //     };
  //     reader.readAsText(file);
  //   }
  // }

  public onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    console.log(file?.type);
    if (file && file.type === "application/json") {
      let offset = 0;
      const chunkSize = 1024 * 1024; // 1MB chunks

      const reader = new FileReader();
      reader.onload = () => {
        // Parse and add chunk to the BehaviorSubject
        const parsedData = JSON.parse(reader.result as string);
        this.jsonService.addData(parsedData);

        // Check if there's more to read
        if (offset < file.size) {
          offset += chunkSize;
          readChunk(offset);
        }
      };

      const readChunk = (startOffset: number) => {
        const blob = file.slice(startOffset, startOffset + chunkSize);
        reader.readAsText(blob);
      };

      // Start reading
      readChunk(0);

      const fileNameWithoutExtension = input?.files?.[0].name.split('.').slice(0, -1).join('.');
      this.router.navigate([fileNameWithoutExtension]);
    }
  }

  // private jsonStreamToComponent(stream: ReadableStream<any>): void {
  //   // We'll implement this function to send our JSON data to the JsonListComponent.
  //   // This part might require more adjustment depending on how you want to 
  //   // organize and structure the components and their interaction.
  //   this.jsonService.setJsonData(stream);
  // }

  public click() {
    this.labelButton.click();
  }
}
