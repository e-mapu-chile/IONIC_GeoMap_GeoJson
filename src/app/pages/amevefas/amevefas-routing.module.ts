import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AmevefasPage } from './amevefas.page';

const routes: Routes = [
  {
    path: '',
    component: AmevefasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AmevefasPageRoutingModule {}
