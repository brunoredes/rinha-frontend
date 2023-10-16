import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class JsonServiceService {

  private jsonDataSubject = new BehaviorSubject<any | any[]>([]);
  jsonData$ = this.jsonDataSubject.asObservable();
  private worker!: Worker;

  constructor() {
    this.worker = new Worker(new URL('../../json-background-worker.worker.ts', import.meta.url));
  }

  public addData(chunk: any) {
    let currentData = this.jsonDataSubject.value;
    if (Array.isArray(chunk)) {
      currentData = [...currentData, ...chunk];
    } else {
      currentData = [...currentData, chunk];
    }
    this.jsonDataSubject.next(currentData);
  }

  public destroyObservable() {
    this.jsonDataSubject.unsubscribe();
  }

  public killWorker() {
    this.worker.terminate();
  }

  public processJsonUsingWorker(file: File): Observable<Object> {
    return new Observable(observer => {
      this.worker.onmessage = ({ data }) => {
        if (data.type === 'completed') {
          observer.complete();
        } else {
          console.log(data);
          observer.next(data);
        }
      };
      this.worker.onerror = (error) => {
        observer.error(error);
      };
      this.worker.postMessage({ file });
    });
  }
  public resetSubject() {
    this.jsonDataSubject.next([]);
  }


}
