import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CondServiDetallePage } from './cond-servi-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: CondServiDetallePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CondServiDetallePage]
})
export class CondServiDetallePageModule {}
