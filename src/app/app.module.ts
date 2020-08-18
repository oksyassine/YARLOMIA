import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './home/welcome.component';
import { UserModule } from './users/user.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileUploadModule } from './file-upload/file-upload.module';
import { RFormModule } from './r-form/r-form.module';
import { MatToolbarModule } from "@angular/material/toolbar";
import { StateParameterService } from "./st-parameter.service";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'home', component: WelcomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home', pathMatch: 'full' }
    ]),
    UserModule,
    RFormModule,
    FileUploadModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSnackBarModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers:[
    StateParameterService
  ],
  exports:[
    MatToolbarModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
