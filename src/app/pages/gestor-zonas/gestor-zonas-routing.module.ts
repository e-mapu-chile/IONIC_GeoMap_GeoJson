import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestorZonasPage } from './gestor-zonas.page';

const routes: Routes = [
  {
    path: '',
    component: GestorZonasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestorZonasPageRoutingModule {}
