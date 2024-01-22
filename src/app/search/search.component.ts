import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialComponments } from '../modules/material-components.module';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { HydrusFile } from '../services/api';
import { FileService } from '../services/file.service';
import { ImageDisplayComponent } from '../image-display/image-display.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    MaterialComponments,
    FormsModule,
    ReactiveFormsModule,
    ImageDisplayComponent
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SearchComponent {
  searchFormControl = new FormControl();
  tags: string[];
  startSearch: boolean;
  loading: boolean;
  hydrusFiles: HydrusFile[];
  continueFilter: boolean;

  constructor(private fileService: FileService, titleService: Title) {
    this.tags = ["system:limit = 5", "system:inbox", "system:no_duration"];
    this.startSearch = false;
    this.loading = false;
    this.hydrusFiles = [];
    this.continueFilter = false;
    titleService.setTitle("Search | Venus\' Arch");
  }
  removeTag(tag: string) {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  addTag(event: MatChipInputEvent): void {
    const value:string = (event.value || '').trim();

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

  searchFiles(): void {
    //temp
    let sortDir = true;
    let sortType = 2;


    if (this.startSearch) {
      this.loading = true;
      this.hydrusFiles = [];


      this.fileService
        .getFileWithMetadataFromSearch(
          this.tags,
          sortType.toString(),
          sortDir.toString()
        )
        .subscribe({
          next: (files) => {
            this.hydrusFiles = files;
            console.log(this.hydrusFiles);
            this.loading = false;
          },
        })
      }
  }
 }
