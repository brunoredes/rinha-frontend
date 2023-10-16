/// <reference lib="webworker" />

import { Observable, from, mergeMap } from "rxjs";
import { JsonError } from "./helper/jsonParser";

addEventListener('message', ({ data }) => {
  const file: File = data.file;
  processJsonStream(file)
    .subscribe({
      next: result => {
        postMessage(result);
      },
      complete: () => {
        postMessage({ type: 'completed' });
      }
    });
});

function processJsonStream(file: File) {
  let buffer = '';
  let bracketCounter = 0;
  let lastProcessedIndex = 0;

  return readFileInChunks(file).pipe(
    mergeMap((chunk: string) => {
      buffer += chunk.trim();

      const results = [];

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
              const jsonObj = JSON.parse(jsonString);
              results.push(jsonObj);
            } catch (error) {
              throw new JsonError();
            }
          }
        }
      }

      buffer = buffer.slice(lastProcessedIndex + (bracketCounter > 0 ? 1 : 0));

      return from(results);
    })
  );
}


function readFileInChunks(file: File, chunkSize: number = 1024 * 1024): Observable<string> {
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