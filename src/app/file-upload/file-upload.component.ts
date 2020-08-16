import { Component, OnInit , EventEmitter,Inject} from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { FileUploadService } from "./upload.service";
import { Router, NavigationStart } from '@angular/router';
import { HttpEventType, HttpResponse, HttpRequest,HttpHeaders,HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, last, map, tap } from 'rxjs/operators';

export function hostFactory() { return window.location.hostname; }

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  providers: [{ provide: 'HOSTNAME', useFactory: hostFactory }]
})
export class FileUploadComponent implements OnInit {
  imageURL: string;
  uploadForm: FormGroup;
  selectedFiles: FileList;
  currentFile: File;
  progress = 0;
  message = '';
  sub :Subscription;
  fileInfos: Observable<any>;
  url:string='/form/pic';
  pageTitle:string ="Upload Portrait";
  complete = new EventEmitter<string>();
  rootURL='';
  constructor(@Inject('HOSTNAME') private hostname: string,private router : Router,public fb: FormBuilder,private fileUploadService: FileUploadService,private _http: HttpClient) {
    if (hostname=='localhost')
      this.rootURL='http://'+hostname;
    else
      this.rootURL='https://'+hostname;
    //console.log(this.rootURL);
    // Reactive Form
    this.uploadForm = this.fb.group({
      avatar: [null],
      name: ['']
    });
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationStart) {
          this.url=event.url;
      }
  });
  }

selectFile(event): void {
  this.selectedFiles = event.target.files;
  const file = (event.target as HTMLInputElement).files[0];
    this.uploadForm.patchValue({
      avatar: file
    });
    this.uploadForm.get('avatar').updateValueAndValidity()
    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
    reader.readAsDataURL(file)
}
ngOnInit(): void {
  if (this.router.url === '/form/pic') {
    this.pageTitle = "Upload Portrait";
  }
  else if (this.router.url === '/form/bio') {
    this.pageTitle = "Upload Biometry Info";
  }
}

  // Image Preview
  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.uploadForm.patchValue({
      avatar: file
    });
    this.uploadForm.get('avatar').updateValueAndValidity()

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
    reader.readAsDataURL(file)

  }

  // Submit Form
  /*submit() {
    console.log(this.url);
    if (this.url=="/form/bio") {
      this.url="/";
      console.log(this.url);
      this.pageTitle = "Upload Biometry Info";

    }else if (this.url=="/form/pic") {
      console.log(this.url);
      this.url="/form/bio";
      this.router.navigate([this.url]);
    }
  }*/
  upload(): void {
    this.progress = 0;
    this.currentFile = this.selectedFiles.item(0);
    this.uploadFile(this.currentFile);
    /*console.log(this.currentFile);
    this.fileUploadService.upload(this.currentFile).subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
          console.log(event.body.message);
          //this.fileInfos = this.fileUploadService.getFiles();
        }
      },
      err => {
        this.progress = 0;
        this.message = 'Could not upload the file!';
        this.currentFile = undefined;
      });*/
    this.selectedFiles = undefined;
  }
  private uploadFile(file: File) {
    const fd = new FormData();
    fd.append('uploads[]', file,file.name);
    const req = new HttpRequest('POST', this.rootURL+'/api/upload', fd, {
          reportProgress: true,
          responseType: 'json'
    });
    this.sub=this._http.request(req).pipe(
          map(event => {
                switch (event.type) {
                      case HttpEventType.UploadProgress:
                        this.progress = Math.round(event.loaded * 100 / event.total);
                            break;
                      case HttpEventType.Response:
                            return event;
                }
          }),
          tap(message => { }),
          last()
    ).subscribe(
          (event: any) => {
                if (typeof (event) === 'object') {
                      //this.complete.emit(event.body);
                      console.log(event.body);
                      this.message = 'Uploaded Successfully!';
                      if (this.router.url === '/form/pic')
                        this.url='/form/bio';
                      else if (this.router.url === '/form/bio')
                        this.url='/';
                      setTimeout(() =>
                      {
                          this.router.navigate([this.url]);
                      },
                      2000);
                }
          },
          err => {
            this.progress = 0;
            this.message = 'Could not upload the file!';
            this.currentFile = undefined;
          }
    );

}
}
