import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/services/auth-guard.service';
import { LoginComponent } from './auth/components/login/login.component';
import { HomeComponent } from './modules/home/home.component';
import { SiteComponent } from './modules/site/site.component';
import { NewprojectComponent } from './modules/newproject/newproject.component';
import { UserMgmntComponent } from './modules/user-mgmnt/user-mgmnt.component';
import { SiteDetailComponent } from './modules/site-detail/site-detail.component';
import { TestmapComponent } from './modules/testmap/testmap.component';
import { MinimapComponent } from './modules/minimap/minimap.component';


const routes: Routes = [
//  { path: '', component : LoginComponent },
 { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
 { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),},
 { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
 { path: 'home/site', component: SiteComponent, canActivate: [AuthGuard] },
 { path: 'home/site/site-detail', component: SiteDetailComponent, canActivate: [AuthGuard] },
 { path: 'home/newproject', component: NewprojectComponent, canActivate: [AuthGuard] },
 { path: 'home/user-mgmnt', component: UserMgmntComponent, canActivate: [AuthGuard] },

 { path: 'testmap', component: TestmapComponent, canActivate: [AuthGuard] },
 { path: 'minimap', component: MinimapComponent, canActivate: [AuthGuard] },

 //{ path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
