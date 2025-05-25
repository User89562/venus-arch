import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { InjectorService } from '../services/injector.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { HydrusFile } from '../services/api';
import { MaterialComponents } from '../modules/material-components.module';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [
    CommonModule,
    MaterialComponents
  ],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayComponent implements OnInit, OnDestroy{
  loading = true;
  subscriptions: Subscription[];
  hydrusFile!: HydrusFile;


  constructor(private injectorService: InjectorService){
    this.subscriptions = [];
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.subscriptions.push(
      this.injectorService.fullscreenOverlaySourceFound$.subscribe((f) => {
        this.hydrusFile = f;
        this.loading = false;
      })
    );
  }
  closeFullscreen(): void {
    this.injectorService.closeOverlay('msg');
  }

  imageType(mime?: string): boolean {
    if (mime?.includes("video")) {
      return false;
    }
    return true;
  }

  onLoad(): void {
    this.loading = false;
  }
 }
