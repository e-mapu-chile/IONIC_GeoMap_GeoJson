import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestorPoligonosPageRoutingModule } from './gestor-poligonos-routing.module';

import { GestorPoligonosPage } from './gestor-poligonos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestorPoligonosPageRoutingModule
  ],
  declarations: [GestorPoligonosPage]
})
export class GestorPoligonosPageModule {}
