import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, mergeMap } from 'rxjs';
import { StreamJsonError } from '../errors/streamJsonError';
@Injectable({
  providedIn: 'root'
})
export class JsonServiceService {

  private jsonDataSubject = new BehaviorSubject<any | any[]>([]);
  jsonData$ = this.jsonDataSubject.asObservable();


  public addData(chunk: any) {
    const currentValue = this.jsonDataSubject.value;

    if (Array.isArray(chunk)) {
      this.jsonDataSubject.next([...currentValue, ...chunk]);
    } else {
      this.jsonDataSubject.next([...currentValue, chunk]);
    }
  }

  public processJsonStream(file: File) {
    let buffer = '';
    let bracketCounter = 0;
    let lastProcessedIndex = 0;

    return this.readFileInChunks(file).pipe(
      mergeMap((chunk: string) => {
        buffer += chunk;
        const results = [];

        for (let i = 0; i < buffer.length; i++) {
          if (buffer[i] === '{') {
            bracketCounter++;
          } else if (buffer[i] === '}') {
            bracketCounter--;

            if (bracketCounter === 0) {
              // We've found a complete JSON object.
              const jsonString = buffer.slice(lastProcessedIndex, i + 1);
              lastProcessedIndex = i + 1; // Update the index for the next slice
              console.log(jsonString);
              const stringifiedJson = JSON.stringify(jsonString);
              const jsonObj = this.parseJson(stringifiedJson);
              results.push(jsonObj);
            }
          }
        }

        buffer = buffer.slice(lastProcessedIndex);  // Keep the unprocessed portion of the buffer for the next chunk

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

  public parseJson(data: any) {
    try {
      return JSON.parse(data);
    } catch (error) {
      throw new StreamJsonError(error);
    }
  }

}
