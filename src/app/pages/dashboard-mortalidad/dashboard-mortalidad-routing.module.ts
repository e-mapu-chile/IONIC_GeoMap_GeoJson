import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardMortalidadPage } from './dashboard-mortalidad.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardMortalidadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardMortalidadPageRoutingModule {}
