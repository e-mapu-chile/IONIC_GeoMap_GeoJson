import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DescargasExcelPage } from './descargas-excel.page';

const routes: Routes = [
  {
    path: '',
    component: DescargasExcelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DescargasExcelPageRoutingModule {}
