import { AbstractControl, ValidationErrors } from "@angular/forms";
import { Observable, of } from "rxjs";

export function jsonValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    const file: File | null = control.value;
    if (file && file instanceof File) {
        const fileReader = new FileReader();
        fileReader.readAsText(file, "UTF-8");
        return new Observable(observer => {
            fileReader.onload = () => {
                try {
                    JSON.parse(fileReader.result as string);
                    observer.next(null);
                } catch (e) {
                    observer.next({ invalidJson: true });
                }
                observer.complete();
            };
            fileReader.onerror = () => {
                observer.next({ invalidJson: true });
                observer.complete();
            };
        });
    }
    return of(null);  // If not a file, consider valid or return an error based on your use case
}