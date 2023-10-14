import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function acceptedFormatValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;  // if no file is selected, we won't validate the format
        }
        const fileName: string = control.value instanceof File ? control.value.name : control.value;
        const fileExtensionRegex = /\.json$/i;
        return fileExtensionRegex.test(fileName) ? null : { invalidFormat: true };
    }
}
