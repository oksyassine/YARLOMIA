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
  getUpdates() {
      let subject = this.subj;
      if (typeof(EventSource) !== 'undefined') {
          this.evs = new EventSource('/api/state');
          this.evs.onopen = function(e) {
              console.log("Opening connection.Ready State is " + this.readyState);
              subject.next(true);
          }
          /*this.evs.onmessage = function(e) {
              console.log("Message Received.Ready State is " + this.readyState);
              subject.next(JSON.parse(e.data));
          }*/
          this.evs.addEventListener("db", function(e) {
              subject.next(e["data"]);
          })
          this.evs.onerror = function(e) {
            subject.next(false);
              console.log(e);
              if (this.readyState == 0) {
                  console.log("Reconnecting…");
              }
          }
      }
  }
  stopUpdates() {
      this.evs.close();
  }
}
