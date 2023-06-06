import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CargaMortalidadPageRoutingModule } from './carga-mortalidad-routing.module';

import { CargaMortalidadPage } from './carga-mortalidad.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CargaMortalidadPageRoutingModule
  ],
  declarations: [CargaMortalidadPage]
})
export class CargaMortalidadPageModule {}
