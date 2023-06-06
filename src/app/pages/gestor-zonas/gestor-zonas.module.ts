import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestorZonasPageRoutingModule } from './gestor-zonas-routing.module';

import { GestorZonasPage } from './gestor-zonas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestorZonasPageRoutingModule
  ],
  declarations: [GestorZonasPage]
})
export class GestorZonasPageModule {}
