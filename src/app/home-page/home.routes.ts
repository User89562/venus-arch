import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page.component';
import { SearchComponent } from '../search/search.component';
import { LandingPageComponent } from '../landing-page/landing-page.component';


export const HOME_ROUTES: Routes =[
    {
        path: "",
        component: HomePageComponent,
        children: [
            {path: "", component: LandingPageComponent},
            {path: 'search', component: SearchComponent}
        ]
    }
];
