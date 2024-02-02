
import { EventEmitter, Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HydrusFile, UserFiles } from "./api";

@Injectable({
  providedIn: "root",
})
export class InjectorService {
  constructor() {}

  // Observable  sources
  private processingSource = new EventEmitter<Map<string, string>>();
  private overlaySource = new Subject<string>();
  private fullscreenOverlaySource = new Subject<HydrusFile>();
  private sendFilesSource = new Subject<{files: UserFiles, makeChanges: boolean, continueFilter: boolean}>();


  // Observable streams
  proccessingFound$ = this.processingSource.asObservable();
  overlaySourceFound$ = this.overlaySource.asObservable();
  fullscreenOverlaySourceFound$ = this.fullscreenOverlaySource.asObservable();
  sendFilesSourceFound$ = this.sendFilesSource.asObservable();

  announceFullscreenOverlay(file: HydrusFile): void {
    this.fullscreenOverlaySource.next(file);
  }


  closeOverlay(msg: string): void {
    this.overlaySource.next(msg);
  }
}
