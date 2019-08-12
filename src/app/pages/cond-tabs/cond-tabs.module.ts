import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CondTabsPage } from './cond-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: CondTabsPage,
    children: [{
      path: 'Home',
      loadChildren: '../cond-home/cond-home.module#CondHomePageModule'
    },
    {
      path: 'Notificaciones',
      loadChildren: '../cond-noti/cond-noti.module#CondNotiPageModule'
    },
    {
      path: 'Perfil',
      loadChildren: '../cond-perfil/cond-perfil.module#CondPerfilPageModule'
    }]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CondTabsPage]
})
export class CondTabsPageModule { }
