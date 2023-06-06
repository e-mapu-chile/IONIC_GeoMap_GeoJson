import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AmevefasPageRoutingModule } from './amevefas-routing.module';

import { AmevefasPage } from './amevefas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AmevefasPageRoutingModule
  ],
  declarations: [AmevefasPage]
})
export class AmevefasPageModule {}
