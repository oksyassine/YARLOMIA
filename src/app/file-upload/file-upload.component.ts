import { Component, OnInit , EventEmitter,Inject} from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { FileUploadService } from "./upload.service";
import { Router, NavigationStart } from '@angular/router';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { StateParameterService } from '../shared/st-parameter.service';
import { EventService } from '../shared/event.service';

/**
 * Upload Page at /form/pic and /form/bio
 */
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  /** URL of the image */
  imageURL: string;
  /** FormGroup of the upload form */
  uploadForm: FormGroup;
  /** Selected files from the user */
  selectedFiles: FileList;
  /** Current File selected */
  currentFile: File;
  /** Progress of the upload */
  progress = 0;
  /** Message shown to the user when the upload has been succefully done or not */
  message:string;
  /** the next URL to visit */
  url:string;
  /** Page Title */
  pageTitle:string;
  /** Type of the image sent (Portrait or fingerprint) */
  type:string;
  /**
   * Construct the component and Build the reactive form
   * @param router use Router service to navigate among views
   * @param stService use the fields in the bag or to backup the image uploaded
   * @param fb Build a Reactive Form
   * @param fileUploadService Inject the File Upload Service
   */
  constructor(private router : Router,private stService :StateParameterService,
    public fb: FormBuilder,private fileUploadService: FileUploadService) {
    // Reactive Form
    this.uploadForm = this.fb.group({
      avatar: [null],
      name: ['']
    });
  }
  /**
   * Initiate the component with the title according to the router url
   */
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
  /**
   * This function is triggered when the user chooses an image to upload so the preview will be shown in the page
   * @param event Event target containing the image file
   */
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
  /**
   * This function is triggered when the user hits the button to upload the photo
   */
  upload(): void {
    this.progress = 0;
    this.currentFile = this.selectedFiles.item(0);

    this.fileUploadService.postImg(this.currentFile,this.stService.id,this.stService.host,this.type).subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
          //console.log(event.body.message);
          this.message = 'Uploaded Successfully!';
          if (this.router.url === '/form/pic'){
            this.stService.pic=this.currentFile;
            this.url='/form/bio';
          }
          else if (this.router.url === '/form/bio'){
            this.stService.form=null;
            this.stService.pic=null;
            if(this.stService.host==EventService.local)
              this.stService.busy.emit(false);
            this.url='/';
          }
          setTimeout(() =>
          {
              this.router.navigate([this.url]);
          },
          1000);

          this.selectedFiles = undefined;
        }
      },
      err => {
        this.progress = 0;
        this.message = 'Could not upload the file!';
        //this.currentFile = undefined;
      });

  }
}
