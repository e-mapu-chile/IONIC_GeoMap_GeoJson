import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestorPoligonosPage } from './gestor-poligonos.page';

const routes: Routes = [
  {
    path: '',
    component: GestorPoligonosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestorPoligonosPageRoutingModule {}
