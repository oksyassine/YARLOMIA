import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent,HttpHeaders } from  '@angular/common/http';
import { Observable, } from 'rxjs';

/** FileUploadService Injectable */
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  /**
   * Constructs the Injectable
   * @param http HTTP Client
   */
  constructor(private http: HttpClient) { }
  /**
   * Build the post request of the image to the server
   * @param file File Object to upload
   * @param id Citizen ID to append to the formdata of the request
   * @param hostname URL of the server (remote or local)
   * @param type Refers to the type of the image (Portrait or fingerprint)
   */
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
