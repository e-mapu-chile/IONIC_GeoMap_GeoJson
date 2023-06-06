import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DescargasExcelPageRoutingModule } from './descargas-excel-routing.module';

import { DescargasExcelPage } from './descargas-excel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DescargasExcelPageRoutingModule
  ],
  declarations: [DescargasExcelPage]
})
export class DescargasExcelPageModule {}
