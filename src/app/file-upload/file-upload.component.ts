import { Component, OnInit , EventEmitter,Inject} from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { FileUploadService } from "./upload.service";
import { Router, NavigationStart } from '@angular/router';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { StateParameterService } from '../shared/st-parameter.service';

export function hostFactory() { return window.location.hostname; }

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  imageURL: string;
  uploadForm: FormGroup;
  selectedFiles: FileList;
  currentFile: File;
  progress = 0;
  message:string;
  url:string;
  pageTitle:string;
  type:string;
  constructor(private router : Router,private stService :StateParameterService,
    public fb: FormBuilder,private fileUploadService: FileUploadService) {
    // Reactive Form
    this.uploadForm = this.fb.group({
      avatar: [null],
      name: ['']
    });
  }
  ngOnInit(): void {
    if (this.router.url == '/form/pic') {
      this.pageTitle = "Upload Portrait";
      this.type="pic";
    }
    else if (this.router.url == '/form/bio') {
      this.pageTitle = "Upload Biometry Info";
      this.type="bio";
    }
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

  upload(): void {
    this.progress = 0;
    this.currentFile = this.selectedFiles.item(0);
    this.fileUploadService.postImg(this.currentFile,this.stService.id,this.stService.host,this.type).subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
          console.log(event.body.message);
          this.message = 'Uploaded Successfully!';
          if (this.router.url === '/form/pic')
            this.url='/form/bio';
          else if (this.router.url === '/form/bio')
            this.url='/';
          setTimeout(() =>
          {
              this.router.navigate([this.url]);
          },
          1000);

        }
      },
      err => {
        this.progress = 0;
        this.message = 'Could not upload the file!';
        //this.currentFile = undefined;
      });
    this.selectedFiles = undefined;
  }
}
