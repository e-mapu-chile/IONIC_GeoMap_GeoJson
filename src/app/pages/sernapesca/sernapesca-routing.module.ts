import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SernapescaPage } from './sernapesca.page';

const routes: Routes = [
  {
    path: '',
    component: SernapescaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SernapescaPageRoutingModule {}
