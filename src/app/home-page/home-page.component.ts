import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MaterialComponments } from '../modules/material-components.module';


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, MaterialComponments, RouterModule
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent { 
  navLinks = [
    {path: 'search', label: 'Search'},
    {path: 'archive-delete-filter', label: 'Archive/Delete'},
  ];
}
