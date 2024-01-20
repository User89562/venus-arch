import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MaterialComponments } from '../modules/material-components.module';
import { HydrusFile } from '../services/api';

@Component({
  selector: 'app-image-display',
  standalone: true,
  imports: [
    CommonModule,
    MaterialComponments
  ],
  templateUrl: './image-display.component.html',
  styleUrl: './image-display.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageDisplayComponent { 
  @Input() hydrusFile!: HydrusFile;
  @Input() heightNum: number;
  @Input() widthNum: number;
  @Input() thumbnail!: boolean;
  fileType: string;

  constructor() { 
    this.fileType = '';
    this.heightNum = 0;
    this.widthNum = 0;
  }

  ngOnInit(): void {
    if (this.hydrusFile.mime.includes('video')){
      this.fileType = 'video';
    } else if (this.hydrusFile.mime.includes('gif')){
      this.fileType = 'gif';
    } else if (this.hydrusFile.mime.includes('image')){
      this.fileType = 'image';
    }
  }

  /*
  determineFileTitle(): string {
    let series = '';

      this.hydrusFile.service_names_to_statuses_to_display_tags['all known tags'][0].forEach(element => {
        if (element.includes('series')){
          series += element.substring(element.indexOf(':')+1) +', ';
        } 
      });

      return (series).trimEnd().slice(0, -1);


  

    
    return '';

    


  }  */

  isPlayable(file: HydrusFile): boolean {
    if (file.mime.includes('video') || file.mime.includes('gif')){
      return true;
    }
    return false;
  }

}
