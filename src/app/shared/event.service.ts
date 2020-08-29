import {BehaviorSubject} from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor() {}
  evs: EventSource;
  private subj = new BehaviorSubject([]);
  returnAsObservable() {
      return this.subj.asObservable();
  }
  getUpdates() {
      let subject = this.subj;
      if (typeof(EventSource) !== 'undefined') {
          this.evs = new EventSource('/api/test');
          this.evs.onopen = function(e) {
              console.log("Opening connection.Ready State is " + this.readyState);
          }
          this.evs.onmessage = function(e) {
              console.log("Message Received.Ready State is " + this.readyState);
              subject.next(JSON.parse(e.data));
          }
          this.evs.addEventListener("db", function(e) {
              console.log("DB event Received. Local Mode.");
              subject.next(e["data"]);
          })
          this.evs.onerror = function(e) {
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
