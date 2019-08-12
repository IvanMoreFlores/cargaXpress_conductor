import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'cond-splash', pathMatch: 'full' },
  { path: 'cond-login', loadChildren: './pages/cond-login/cond-login.module#CondLoginPageModule' },
  { path: 'cond-recuperar', loadChildren: './pages/cond-recuperar/cond-recuperar.module#CondRecuperarPageModule' },
  { path: 'cond-tabs', loadChildren: './pages/cond-tabs/cond-tabs.module#CondTabsPageModule' },
  { path: 'cond-home', loadChildren: './pages/cond-home/cond-home.module#CondHomePageModule' },
  { path: 'cond-noti', loadChildren: './pages/cond-noti/cond-noti.module#CondNotiPageModule' },
  { path: 'cond-perfil', loadChildren: './pages/cond-perfil/cond-perfil.module#CondPerfilPageModule' },
  { path: 'cond-splash', loadChildren: './pages/cond-splash/cond-splash.module#CondSplashPageModule' },
  { path: 'cond-servi-detalle/:id', loadChildren: './pages/cond-servi-detalle/cond-servi-detalle.module#CondServiDetallePageModule' },
  { path: 'cond-servi-seguimi/:id', loadChildren: './pages/cond-servi-seguimi/cond-servi-seguimi.module#CondServiSeguimiPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
