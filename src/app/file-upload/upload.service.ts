import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpErrorResponse,HttpHeaders } from  '@angular/common/http';
import { Observable, throwError } from 'rxjs';

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

    if (url=="/form/pic")
      this.type="/pic";
    else
    this.type="/bio";
    const req = new HttpRequest('POST', '/api/upload'+this.type, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

}
