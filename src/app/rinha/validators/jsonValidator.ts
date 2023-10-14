import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";
import { JsonError, jsonParser } from "src/app/helper/jsonParser";

export function jsonValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    const file: File | null = control.value;
    if (file && file instanceof File) {
        const fileReader = new FileReader();
        fileReader.readAsText(file, "UTF-8");
        return new Observable(observer => {
            fileReader.onload = () => {
                try {
                    jsonParser(fileReader.result as string);
                    observer.next(null);
                } catch (e) {
                    if (e instanceof JsonError) {
                        observer.next({ invalidJson: true });
                    }
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

// export function jsonValidator(): AsyncValidatorFn {
//     return (control: AbstractControl): Observable<ValidationErrors | null> => {
//         const file: File | null = control.value;
//         if (file && file instanceof File) {
//             const fileReader = new FileReader();
//             return new Observable((observer: Observer<ValidationErrors | null>) => {
//                 fileReader.onload = () => {
//                     try {
//                         jsonParser(fileReader.result as string);
//                         observer.next(null);
//                     } catch (e) {
//                         observer.next({ invalidJson: true });
//                     } finally {
//                         observer.complete();
//                     }
//                 };
//                 fileReader.onerror = () => {
//                     observer.next({ invalidJson: true });
//                     observer.complete();
//                 };

//                 fileReader.readAsText(file, "UTF-8");

//                 // This returns a teardown logic in case subscription to this observable ends (component gets destroyed)
//                 return () => {
//                     fileReader.abort();  // Abort reading file if observer gets destroyed (component using validator is destroyed)
//                 };
//             });
//         }
//         return of(null);
//     };
// }