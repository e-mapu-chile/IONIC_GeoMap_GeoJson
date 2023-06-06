import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IngresoMortalidadPageRoutingModule } from './ingreso-mortalidad-routing.module';

import { IngresoMortalidadPage } from './ingreso-mortalidad.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IngresoMortalidadPageRoutingModule
  ],
  declarations: [IngresoMortalidadPage]
})
export class IngresoMortalidadPageModule {}
