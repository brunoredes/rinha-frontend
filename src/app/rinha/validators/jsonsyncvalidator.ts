import { AbstractControl, ValidationErrors } from "@angular/forms";

export function jsonSyncValidator(control: AbstractControl): ValidationErrors | null {
    const file: File | null = control.value;
    if (!file) {
        return null;
    }

    if (file && file instanceof File) {

        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            const content = reader.result as string;
            try {
                JSON.parse(content);
                return null;
            } catch (error) {
                console.error({ error });
                return { jsonError: true };
            }
        }
    }

    return null;

}
