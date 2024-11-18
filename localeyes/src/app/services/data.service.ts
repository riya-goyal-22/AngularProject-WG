import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})

export class DataService {
  loadingSubject = new BehaviorSubject<boolean>(false);
  loader$ = this.loadingSubject as Observable<boolean>
}