import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargaMortalidadPage } from './carga-mortalidad.page';

const routes: Routes = [
  {
    path: '',
    component: CargaMortalidadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CargaMortalidadPageRoutingModule {}
