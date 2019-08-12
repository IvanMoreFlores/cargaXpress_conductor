import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CondServiSeguimiPage } from './cond-servi-seguimi.page';

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
    RouterModule.forChild(routes)
  ],
  declarations: [CondServiSeguimiPage]
})
export class CondServiSeguimiPageModule {}
