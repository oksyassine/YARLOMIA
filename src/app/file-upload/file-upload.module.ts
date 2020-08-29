import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadComponent } from './file-upload.component';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { FormGuard } from "./form.guard";
@NgModule({
  declarations: [
    FileUploadComponent,
  ],
  imports: [
    BrowserModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    MaterialFileInputModule,
    RouterModule.forChild([
      { path: 'form/pic', canActivate: [FormGuard], component: FileUploadComponent },
      { path: 'form/bio', canActivate: [FormGuard], component: FileUploadComponent }
    ]),
  ],
  exports:[
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class FileUploadModule { }
