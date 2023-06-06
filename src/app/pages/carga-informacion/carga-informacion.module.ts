import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CargaInformacionPageRoutingModule } from './carga-informacion-routing.module';

import { CargaInformacionPage } from './carga-informacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CargaInformacionPageRoutingModule
  ],
  declarations: [CargaInformacionPage]
})
export class CargaInformacionPageModule {}
