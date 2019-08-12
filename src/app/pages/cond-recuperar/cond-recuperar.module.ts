import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CondRecuperarPage } from './cond-recuperar.page';

const routes: Routes = [
  {
    path: '',
    component: CondRecuperarPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CondRecuperarPage]
})
export class CondRecuperarPageModule {}
