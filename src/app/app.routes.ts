import { Routes } from '@angular/router';
import { BrowseComponent } from './pages/browse/browse.component';

// export const routes: Routes = [
//     {path:'browse',loadComponent:()=>import('./pages/browse/browse.component').then(a=>a.BrowseComponent)}
// ];


export const routes: Routes = [
    {
        path:'',
        component:BrowseComponent
    },
   
];