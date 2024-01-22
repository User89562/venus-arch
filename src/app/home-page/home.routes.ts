import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page.component';
import { SearchComponent } from '../search/search.component';
import { ArchiveDeleteFilterComponent } from '../archive-delete-filter/archive-delete-filter.component';



export const HOME_ROUTES: Routes =[
    {
        path: "",
        component: HomePageComponent,
        children: [
            {path: "", component: ArchiveDeleteFilterComponent},
            {path: 'search', component: SearchComponent},
            {path: 'archive-delete-filter', component: ArchiveDeleteFilterComponent},
        ]
    }
];
