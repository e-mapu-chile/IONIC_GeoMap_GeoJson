import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PowerBiPage } from './power-bi.page';

const routes: Routes = [
  {
    path: '',
    component: PowerBiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PowerBiPageRoutingModule {}
