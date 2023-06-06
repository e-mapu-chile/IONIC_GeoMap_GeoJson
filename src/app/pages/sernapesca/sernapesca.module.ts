import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SernapescaPageRoutingModule } from './sernapesca-routing.module';

import { SernapescaPage } from './sernapesca.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SernapescaPageRoutingModule
  ],
  declarations: [SernapescaPage]
})
export class SernapescaPageModule {}
