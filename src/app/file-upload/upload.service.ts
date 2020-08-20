import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpErrorResponse,HttpHeaders } from  '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  type:string;
  constructor(private http: HttpClient) { }

  postImg(file: File,id:string,hostname:string,url:string): Observable<HttpEvent<any>> {
    const formData = new FormData();

    formData.append('id',id);
    formData.append('file', file,file.name);
    /*const headerDict = {
      'Content-Type': 'image/jpeg',
      'Access-Control-Allow-Headers': 'Content-Type',
    }*/
    if (url=="/form/pic")
      this.type="/pic";
    else
    this.type="/bio";
    const req = new HttpRequest('POST', '/api/upload'+this.type, formData, {
      reportProgress: true,
      //headers: new HttpHeaders(headerDict),
      responseType: 'json'
    });
    console.log(req);
    return this.http.request(req);
  }

  /*postFile(fileToUpload: File): Observable<Object> {
    const endpoint = 'http://localhost:8080/api/upload/';
    const formData: FormData = new FormData();
    const headerDict = {
      'Content-Type': 'image/jpeg',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.http
      .post(endpoint, formData,{
        headers: new HttpHeaders(headerDict),
      })
}*/
  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
