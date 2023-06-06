import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargaInformacionPage } from './carga-informacion.page';

const routes: Routes = [
  {
    path: '',
    component: CargaInformacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CargaInformacionPageRoutingModule {}
