import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardMortalidadPageRoutingModule } from './dashboard-mortalidad-routing.module';

import { DashboardMortalidadPage } from './dashboard-mortalidad.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardMortalidadPageRoutingModule
  ],
  declarations: [DashboardMortalidadPage]
})
export class DashboardMortalidadPageModule {}
