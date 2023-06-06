import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresoMortalidadPage } from './ingreso-mortalidad.page';

const routes: Routes = [
  {
    path: '',
    component: IngresoMortalidadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IngresoMortalidadPageRoutingModule {}
