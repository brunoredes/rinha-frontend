import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonServiceService {

  private dataSubject = new BehaviorSubject<any[]>([]);
  data$ = this.dataSubject.asObservable();

  public addData(chunk: any[]) {
    console.log(chunk)
    const currentValue = this.dataSubject.value;
    this.dataSubject.next([...currentValue, ...chunk.slice(0)]);
  }

  public isValidJson(data: any): boolean {
    return data && typeof data === 'object' && data !== null;
  }


}
