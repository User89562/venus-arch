import { HydrusServiceSimple } from "./../ratings/hydrus-services";
import { HydrusFile, RatingFileChanges, UserFiles } from "./../services/api";
import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MaterialComponments } from "../modules/material-components.module";
import { ImageDisplayComponent } from "../image-display/image-display.component";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";
import { FileService } from "../services/file.service";
import { Subscription, forkJoin } from "rxjs";
import {
  CdkVirtualScrollViewport,
  ScrollingModule,
  ViewportRuler,
} from "@angular/cdk/scrolling";
import { ApiService } from "../services/api.service";
import { HydrusServiceInfo } from "../ratings/hydrus-services";
import {
  HydrusRating,
} from "../ratings/hydrus-rating";
import {
  isIncDecRatingService,
  isLikeRatingService,
  isNumericalRatingService,
  isRatingService,
} from "../utils/rating-util";
import { BarRatingModule } from "ngx-bar-rating";
import { MatDialog } from "@angular/material/dialog";
import { DialogFormComponent } from "../dialog-form/dialog-form.component";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-archive-delete-filter",
  standalone: true,
  imports: [
    CommonModule,
    MaterialComponments,
    ImageDisplayComponent,
    FormsModule,
    ReactiveFormsModule,
    BarRatingModule,
    ScrollingModule,
  ],
  templateUrl: "./archive-delete-filter.component.html",
  styleUrl: "./archive-delete-filter.component.scss",
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ArchiveDeleteFilterComponent implements OnInit, OnDestroy {
  searchFormControl = new FormControl();
  tags: string[];
  startSearch: boolean;
  loading: boolean;
  hydrusFiles: HydrusFile[];
  continueFilter: boolean;
  viewportChangeSub!: Subscription;
  subscriptions: Subscription[];
  itemSet: HydrusFile[][] = [];
  chunkSize: number;
  itemHeight: number = 430;
  itemWidth: number = 495;
  h = 0;
  allServices!: HydrusServiceInfo;
  ratingServices: Map<string, HydrusRating>;
  ratingValue: number = 0;
  ratingFileChanges: RatingFileChanges[];
  continue: boolean;
  userFileChanges: UserFiles;
  processing: boolean = false;
  @ViewChild(CdkVirtualScrollViewport) virtualScroll!: CdkVirtualScrollViewport;
  ratingIconsOutline: any;
  ratingIcons: any;

  constructor(
    private fileService: FileService,
    private apiService: ApiService,
    private readonly viewportRuler: ViewportRuler,
    private readonly ngZone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog,
    titleService: Title
  ) {
    this.tags = ["system:limit = 8", "system:inbox", "system:no_duration"];
    this.startSearch = false;
    this.loading = false;
    this.hydrusFiles = [];
    this.continueFilter = false;
    this.subscriptions = [];
    this.ratingFileChanges = [];
    this.chunkSize = 1;
    this.userFileChanges = new UserFiles();
    this.continue = true;
    this.ratingServices = new Map<string, HydrusRating>();
    titleService.setTitle("Archive/Delete Filter | Venus\' Arch");
  }

  isNumericalRatingService = isNumericalRatingService;
  isLikeRatingService = isLikeRatingService;
  isIncDecRatingService = isIncDecRatingService;

  ngOnInit(): void {
    this.calcChunkSize();
    //   this.generateDataChunk(this.hydrusFiles);

    //https://stackoverflow.com/questions/35527456/angular-window-resize-event
    this.viewportChangeSub = this.viewportRuler
      .change(200)
      .subscribe(() =>
        this.ngZone.run(() => this.generateDataChunk(this.hydrusFiles))
      );

    this.apiService.getServices().subscribe({
      next: (services) => {
        this.allServices = services;
        for (let key in this.allServices.services) {
          let value = this.allServices.services[key];
          if (isRatingService(value)) {
            this.ratingServices.set(key, value);
          }
        }
      },
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
    this.viewportChangeSub.unsubscribe();
  }

  returnService(a: HydrusRating | undefined): HydrusServiceSimple {
    return a as HydrusServiceSimple;
  }

  isFileSelected(file: HydrusFile): string {
    if (this.userFileChanges.archive.includes(file)) {
      return "8px solid #00e676";
    } else if (this.userFileChanges.skipped.includes(file)) {
      return "8px solid  #007ac1";
    }
    return "8px solid #424242";
  }

  isFilePendingArchive(file: HydrusFile): boolean {
    return this.userFileChanges.archive.includes(file);
  }

  removeFromArchive(file: HydrusFile) {
    if (this.userFileChanges.archive.includes(file)) {
      this.userFileChanges.archive.splice(
        this.userFileChanges.archive.indexOf(file),
        1
      );
      this.ratingValue = 0;
      this.ratingFileChanges = this.ratingFileChanges.filter(
        (r) => r.hash != file.hash
      );
    }
  }

  // https://stackoverflow.com/questions/57476762/angular-material-cdk-virtual-scroll-viewport-how-to-render-multiple-items-per-r
  generateDataChunk(data: any) {
    this.calcChunkSize();
    let index: number;
    let dataChunk: [][] = [];
    for (index = 0; index < data.length; index += this.chunkSize) {
      dataChunk.push(data.slice(index, index + this.chunkSize));
    }
    this.itemSet = dataChunk;
  }

  calcChunkSize(): void {
    let w = window.innerWidth;
    this.chunkSize = Math.floor(w / (this.itemWidth + 100));
    this.h =
      Math.ceil(this.hydrusFiles.length / this.chunkSize) *
      (this.itemHeight + 155 + 145);
  }

  removeTag(tag: string) {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  addTag(event: MatChipInputEvent): void {
    const value: string = (event.value || "").trim();

    // Add tag
    if (value) {
      this.tags.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  //search functions
  changeSearchStatus(): void {
    this.startSearch = !this.startSearch;
    if (this.startSearch) {
      this.searchFiles();
    }
  }

  openEditDialog(event: any): void {
    let oldSearchTerm = event.target.innerText;
    const dialogRef = this.dialog.open(DialogFormComponent, {
      data: { searchTerm: oldSearchTerm },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.removeTag(oldSearchTerm);
      this.tags.push(result);
    });
  }

  returnNumRating(file: HydrusFile, serviceKey: string): number {
    let i = this.ratingFileChanges.findIndex(
      (r) => r.hash === file.hash && r.rating_service_key === serviceKey
    );

    if (i != -1) {
      return this.ratingFileChanges[i].rating;
    }

    return 0;
  }

  returnLikeDislikeRating(file: HydrusFile, serviceKey: string): any {
    let i = this.ratingFileChanges.findIndex(
      (r) => r.hash === file.hash && r.rating_service_key === serviceKey
    );

    if (i != -1) {
      return this.ratingFileChanges[i].rating;
    }

    return null;
  }

  /*
  trackByRating(index: number, rating: HydrusRating) {
    return rating.service_key;
  }*/

  setRating(eventNum: any, serviceKey: string, file: HydrusFile) {
    //find rating where both hash and serviceKey match
    let i = this.ratingFileChanges.findIndex(
      (r) => r.hash === file.hash && r.rating_service_key === serviceKey
    );

    //if rating has already been added, modify the number
    if (i != -1) {
      this.ratingFileChanges[i].rating = eventNum;
    } else {
      //add rating
      this.ratingFileChanges.push(
        new RatingFileChanges(file.hash, serviceKey, eventNum)
      );
    }

    if (!this.userFileChanges.archive.includes(file)) {
      this.userFileChanges.archive.push(file);
    }
  }

  searchFiles(): void {
    //temp
    let sortDir = true;
    let sortType = 2;

    if (this.startSearch) {
      this.loading = true;
      this.hydrusFiles = [];
      this.changeDetectorRef.detectChanges();

      this.fileService
        .getFileWithMetadataFromSearch(
          this.tags,
          sortType.toString(),
          sortDir.toString()
        )
        .subscribe({
          next: (files) => {
            this.hydrusFiles = files;
            this.generateDataChunk(this.hydrusFiles);
            this.loading = false;
            this.scrollToTop();
          },
        });
    }
  }

  downloadFile(file: HydrusFile): void {
    this.fileService.downloadFile(file).subscribe({
      next: (fileBlob) => {
        const a = document.createElement("a");
        document.body.appendChild(a);
        let url = window.URL.createObjectURL(fileBlob);
        a.href = url;
        let fileName = file.hash;
        //filename + file extension from mime
        a.download = `${fileName}.${file.ext}`;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        window.open(url);
      },
    });
  }

  //determine files to be trashed/archive/changed
  submitFiles(): void {
    let f: HydrusFile[] = this.hydrusFiles;

    /* for full screen
    if (this.currentIndex != this.hydrusFiles.length - 1) {
      f = this.hydrusFiles.slice(0, this.currentIndex);
    } else {
      f = this.hydrusFiles;
    }*/

    this.userFileChanges.delete = [];
    if (
      this.userFileChanges.archive.length > 0 &&
      this.userFileChanges.skipped.length > 0
    ) {
      //remove archive files from all files
      this.userFileChanges.delete = f.filter(
        (files) =>
          !this.userFileChanges.archive
            .map((s) => s.file_id)
            .includes(files.file_id)
      );
      // remove skipped files from first filter result
      this.userFileChanges.delete = this.userFileChanges.delete.filter(
        (files) =>
          !this.userFileChanges.skipped
            .map((s) => s.file_id)
            .includes(files.file_id)
      );
    } else if (this.userFileChanges.archive.length > 0) {
      this.userFileChanges.delete = f.filter(
        (files) =>
          !this.userFileChanges.archive
            .map((s) => s.file_id)
            .includes(files.file_id)
      );
    } else if (this.userFileChanges.skipped.length > 0) {
      this.userFileChanges.delete = f.filter(
        (files) =>
          !this.userFileChanges.skipped
            .map((s) => s.file_id)
            .includes(files.file_id)
      );
    } else {
      this.userFileChanges.delete = f;
    }

    this.updateFileStatuses(this.userFileChanges);
  }

  updateFileStatuses(userFiles: UserFiles): void {
    this.processing = true;
    this.loading = true;
    let archiveIds = userFiles.archive.map((a) => a.file_id);
    let deleteIds = userFiles.delete.map((a) => a.file_id);

    //update file ratings
    if (this.ratingFileChanges.length > 0) {
      this.ratingFileChanges.forEach((element) => {
        this.apiService.editFileRating(element).subscribe({
          error: (e) => {
            console.log(e);
          },
        });
      });
    }

    //update archive/delete statuses
    if (archiveIds.length > 0 && deleteIds.length > 0) {
      this.subscriptions.push(
        forkJoin([
          this.apiService.archiveMultipleFilesById(archiveIds), // result[0]
          this.apiService.deleteMultipleFilesById(deleteIds), // result[1]
        ]).subscribe({
          next: (result) => {
            this.searchFiles();
          },
          error: (e) => {
            console.log(e);
          },
        })
      );
    } else if (deleteIds.length > 0) {
      this.apiService.deleteMultipleFilesById(deleteIds).subscribe({
        next: (delResult) => {
          this.searchFiles();
        },
        error: (e) => {
          console.log(e);
        },
      });
    } else if (archiveIds.length > 0) {
      this.apiService.archiveMultipleFilesById(archiveIds).subscribe({
        next: (delResult) => {
          this.searchFiles();
        },
        error: (e) => {
          console.log(e);
        },
      });
    }
  }


  scrollToTop(): void {
    this.virtualScroll.scrollToIndex(0);
  }
}
