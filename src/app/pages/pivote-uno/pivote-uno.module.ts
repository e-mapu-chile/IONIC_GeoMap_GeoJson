import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PivoteUnoPageRoutingModule } from './pivote-uno-routing.module';

import { PivoteUnoPage } from './pivote-uno.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PivoteUnoPageRoutingModule
  ],
  declarations: [PivoteUnoPage]
})
export class PivoteUnoPageModule {}
