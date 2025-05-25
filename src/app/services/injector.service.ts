
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
  private databaseUpdateSource = new Subject<{archiveNum: number, totalFileChanges: number}>();


  // Observable streams
  processingFound$ = this.processingSource.asObservable();
  overlaySourceFound$ = this.overlaySource.asObservable();
  fullscreenOverlaySourceFound$ = this.fullscreenOverlaySource.asObservable();
  databaseUpdateSource$ = this.databaseUpdateSource.asObservable();



  announceDatabaseUpdate(fileNumChanges: {archiveNum: number, totalFileChanges:number}): void {
    this.databaseUpdateSource.next(fileNumChanges);

  }


  announceFullscreenOverlay(file: HydrusFile): void {
    this.fullscreenOverlaySource.next(file);
  }


  closeOverlay(msg: string): void {
    this.overlaySource.next(msg);
  }
}
