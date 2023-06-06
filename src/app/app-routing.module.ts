import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
 
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'configuracion',
    loadChildren: () => import('./pages/configuracion/configuracion.module').then( m => m.ConfiguracionPageModule)
  },
  {
    path: 'descarga',
    loadChildren: () => import('./pages/descarga/descarga.module').then( m => m.DescargaPageModule)
  },
  {
    path: 'tab1',
    loadChildren: () => import('./tab1/tab1.module').then( m => m.Tab1PageModule)
  },
  {
    path: 'tab2',
    loadChildren: () => import('./tab2/tab2.module').then( m => m.Tab2PageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'power-bi',
    loadChildren: () => import('./pages/power-bi/power-bi.module').then( m => m.PowerBiPageModule)
  },
  {
    path: 'muestras',
    loadChildren: () => import('./pages/muestras/muestras.module').then( m => m.MuestrasPageModule)
  },
  {
    path: 'mapas',
    loadChildren: () => import('./pages/mapas/mapas.module').then( m => m.MapasPageModule)
  },
  {
    path: 'descargas-excel',
    loadChildren: () => import('./pages/descargas-excel/descargas-excel.module').then( m => m.DescargasExcelPageModule)
  },
  {
    path: 'pivote-uno',
    loadChildren: () => import('./pages/pivote-uno/pivote-uno.module').then( m => m.PivoteUnoPageModule)
  },
  {
    path: 'mortalidad',
    loadChildren: () => import('./pages/mortalidad/mortalidad.module').then( m => m.MortalidadPageModule)
  },
  {
    path: 'amevefas',
    loadChildren: () => import('./pages/amevefas/amevefas.module').then( m => m.AmevefasPageModule)
  },
  {
    path: 'sernapesca',
    loadChildren: () => import('./pages/sernapesca/sernapesca.module').then( m => m.SernapescaPageModule)
  },
  {
    path: 'carga-informacion',
    loadChildren: () => import('./pages/carga-informacion/carga-informacion.module').then( m => m.CargaInformacionPageModule)
  },
  {
    path: 'ingreso-mortalidad',
    loadChildren: () => import('./pages/ingreso-mortalidad/ingreso-mortalidad.module').then( m => m.IngresoMortalidadPageModule)
  },
  {
    path: 'gestor-zonas',
    loadChildren: () => import('./pages/gestor-zonas/gestor-zonas.module').then( m => m.GestorZonasPageModule)
  },
  {
    path: 'gestor-poligonos',
    loadChildren: () => import('./pages/gestor-poligonos/gestor-poligonos.module').then( m => m.GestorPoligonosPageModule)
  },
  {
    path: 'carga-mortalidad',
    loadChildren: () => import('./pages/carga-mortalidad/carga-mortalidad.module').then( m => m.CargaMortalidadPageModule)
  },
  {
    path: 'dashboard-mortalidad',
    loadChildren: () => import('./pages/dashboard-mortalidad/dashboard-mortalidad.module').then( m => m.DashboardMortalidadPageModule)
  },
  {
    path: 'mapa-geo',
    loadChildren: () => import('./pages/mapa-geo/mapa-geo.module').then( m => m.MapaGeoPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
