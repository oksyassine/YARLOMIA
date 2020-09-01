import {BehaviorSubject} from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor() {}
  evs: EventSource;
  ret:any;
  private subj = new BehaviorSubject(this.ret);
  returnAsObservable() {
      return this.subj.asObservable();
  }
  getUpdates(host="https://yarlomia.ga") {
      let subject = this.subj;
      let k=-1;
      if (typeof(EventSource) !== 'undefined') {
          this.evs = new EventSource(host+'/api/state');
          this.evs.onopen = function(e) {
              console.log("Opening connection with " + host);
          }
          this.evs.addEventListener("dbx", function(e) {
            if (k==-1 || k==0)
              subject.next(e["data"]+'x');
            k=0;
          });
          this.evs.addEventListener("db", function(e) {
            if (k==-1 || k==0)
              subject.next(e["data"]);
            k=0;
          });
          this.evs.onerror = function(e) {
            if (k==-1){
              if (host=="https://yarlomia.ga")
                subject.next('ex');
              else subject.next('e');
            }
            if(k==2){
              if(host=="https://yarlomia.ga")
                subject.next("rx");
              else subject.next("r");
            }
            if (this.readyState == 0) {
              console.log("Reconnecting… "+host);
              k++;
            }
          }
      }
  }
  stopUpdates() {
    if(this.evs.url=="https://yarlomia.ga/api/state"){
      return null;
    }
    console.log("Closing connection with " + this.evs.url);
      this.evs.close();
  }
}
