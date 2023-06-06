import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PivoteUnoPage } from './pivote-uno.page';

const routes: Routes = [
  {
    path: '',
    component: PivoteUnoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PivoteUnoPageRoutingModule {}
