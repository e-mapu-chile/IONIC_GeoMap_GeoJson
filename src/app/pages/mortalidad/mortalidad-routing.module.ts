import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MortalidadPage } from './mortalidad.page';

const routes: Routes = [
  {
    path: '',
    component: MortalidadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MortalidadPageRoutingModule {}
