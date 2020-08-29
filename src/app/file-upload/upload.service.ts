import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent,HttpHeaders } from  '@angular/common/http';
import { Observable, } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  constructor(private http: HttpClient) { }

  postImg(file: File,id:string,hostname:string,type:string): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('_id',id);
    formData.append('file', file,file.name);

    const req = new HttpRequest('POST', hostname+'/api/upload/'+type, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

}
