import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, from, mergeMap, of } from 'rxjs';
import { StreamJsonError } from '../errors/streamJsonError';
import { jsonParser } from 'src/app/helper/jsonParser';
@Injectable({
  providedIn: 'root'
})
export class JsonServiceService {

  private jsonDataSubject = new BehaviorSubject<any | any[]>([]);
  jsonData$ = this.jsonDataSubject.asObservable();


  public addData(chunk: any) {
    const currentValue = this.jsonDataSubject.value;

    if (Array.isArray(chunk)) {
      this.jsonDataSubject.next([...chunk]);
    } else {
      this.jsonDataSubject.next([chunk]);
    }
  }

  public destroyObservable() {
    this.jsonDataSubject.unsubscribe();
  }

  public processJsonStream(file: File) {
    let buffer = '';
    let bracketCounter = 0;
    let lastProcessedIndex = 0;

    return this.readFileInChunks(file).pipe(
      mergeMap((chunk: string) => {
        buffer += chunk.trim();

        const results = [];

        // Iterate through the buffer and process the JSON strings
        for (let i = 0; i < buffer.length; i++) {
          if (buffer[i] === '{') {
            if (bracketCounter === 0) {
              lastProcessedIndex = i;
            }
            bracketCounter++;
          } else if (buffer[i] === '}') {
            bracketCounter--;

            if (bracketCounter === 0) {
              const jsonString = buffer.slice(lastProcessedIndex, i + 1);

              try {
                const jsonObj = jsonParser(jsonString);
                results.push(jsonObj);
              } catch (error) {
                throw new StreamJsonError(error);
              }
            }
          }
        }

        buffer = buffer.slice(lastProcessedIndex + (bracketCounter > 0 ? 1 : 0));

        return from(results);
      })
    );
  }


  private readFileInChunks(file: File, chunkSize: number = 1024 * 1024): Observable<string> {
    return new Observable((observer) => {
      let offset = 0;

      const reader = new FileReader();

      const readChunk = (startOffset: number) => {
        if (startOffset >= file.size) {
          observer.complete();
          return;
        }

        const slice = file.slice(startOffset, startOffset + chunkSize);
        reader.readAsText(slice);
      };

      reader.onload = (event: any) => {
        observer.next(event.target.result);
        offset += chunkSize;
        readChunk(offset);
      };

      reader.onerror = (error) => {
        observer.error(error);
      };

      readChunk(0);
    });
  }

  // public parseJson(data: any) {
  //   try {
  //     return JSON.parse(data);
  //   } catch (error) {
  //     console.error({ error });
  //     throw new StreamJsonError(error);
  //   }
  // }

}
