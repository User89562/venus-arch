import { BreakpointObserver } from "@angular/cdk/layout";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterModule, RouterOutlet } from "@angular/router";
import { MaterialComponments } from "../modules/material-components.module";
import { ApiService } from "../services/api.service";
import { Boned } from "../services/api";
import { InjectorService } from "../services/injector.service";

@Component({
  selector: "app-home-page",
  standalone: true,
  imports: [CommonModule, RouterOutlet, MaterialComponments, RouterModule],
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"],
})
export class HomePageComponent implements OnInit {
  navLinks = [
    { path: "search", label: "Search" },
    { path: "archive-delete-filter", label: "Archive/Delete" },
  ];
  dbStats!: Boned;
  lastUpdated = new Date();
  constructor(private apiService: ApiService, private injectorService: InjectorService) {}
  ngOnInit(): void {
    this.apiService.howBoned().subscribe({
      next: (stats) => {
        this.dbStats = stats;
      },
    });

    this.injectorService.databaseUpdateSource$.subscribe((numChanges) => {
      this.dbStats.boned_stats.num_archive+=numChanges.archiveNum;
      this.dbStats.boned_stats.num_inbox-=numChanges.totalFileChanges;
    })
  }




  
}
