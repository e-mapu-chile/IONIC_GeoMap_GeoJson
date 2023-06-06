import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PowerBiPageRoutingModule } from './power-bi-routing.module';

import { PowerBiPage } from './power-bi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PowerBiPageRoutingModule
  ],
  declarations: [PowerBiPage]
})
export class PowerBiPageModule {}
