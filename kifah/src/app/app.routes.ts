import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./components/signup/signup.component').then(m => m.SignUpComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'victims',
    loadComponent: () => import('./components/victim-list/victim-list.component').then(m => m.VictimListComponent)
  },
  {
    path: 'victims-simple',
    loadComponent: () => import('./components/victim-list-simple/victim-list-simple.component').then(m => m.VictimListSimpleComponent)
  },
  {
    path: 'victims/submit',
    loadComponent: () => import('./components/victim-submit/victim-submit.component').then(m => m.VictimSubmitComponent)
  },
  {
    path: 'victims/mine',
    loadComponent: () => import('./components/my-victims/my-victims.component').then(m => m.MyVictimsComponent)
  },
  {
    path: 'stats',
    loadComponent: () => import('./components/victim-stats/victim-stats.component').then(m => m.VictimStatsComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./components/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'victim/:id',
    loadComponent: () => import('./components/victim-detail/victim-detail.component').then(m => m.VictimDetailComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
