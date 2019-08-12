import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CondServiSeguimiPage } from './cond-servi-seguimi.page';
import { ComponentsModule } from '../../components/components.module';
import { IonBottomDrawerModule } from 'ion-bottom-drawer';

import { Geolocation } from '@ionic-native/geolocation/ngx';

const routes: Routes = [
  {
    path: '',
    component: CondServiSeguimiPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    IonBottomDrawerModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    Geolocation
  ],
  declarations: [CondServiSeguimiPage]
})
export class CondServiSeguimiPageModule {}
