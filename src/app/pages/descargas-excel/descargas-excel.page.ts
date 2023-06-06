import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Storage } from '@ionic/storage';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-descargas-excel',
  templateUrl: './descargas-excel.page.html',
  styleUrls: ['./descargas-excel.page.scss'],
})
export class DescargasExcelPage implements OnInit {
  loading: HTMLIonLoadingElement;
  establecimientos: any[] = [];
  constructor(private http: HttpClient,
    public loadingController: LoadingController,
    private storage: Storage) { }

  ngOnInit() {
  }

  async cargando(mensaje) {
    this.loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: mensaje
    });
    await this.loading.present();
  }

  async descargar() {
    // let keye = "region_" + regionId;
    const xL = await this.cargando("Espere, descargando el DataSet ");
    const estabAll = await this.storage.get("ExcelPivote1");
    this.establecimientos = estabAll || [];
    const regiones = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    try {
      for await (const r of regiones) {
        console.log(r)

        this.getDataSet(r).subscribe((resp) => {
          let ss = JSON.stringify(resp, null, 4);
          console.log("respuesta API DATASET= " + ss);
          const dataJ = JSON.parse(ss);
          this.loading.dismiss();
        });
      }
      this.loading.dismiss();
    } catch (sfgs) {
      this.loading.dismiss();
    }



    //   const ras = await this._datosMaestros
    //     .getEstablecimientoTEAllXRegion(token, id)
    //     .subscribe((resp) => {
    //       let ss = JSON.stringify(resp.data, null, 4);
    //       //console.log("respuesta API X REGion= " + ss);
    //       if ("storage" in navigator && "estimate" in navigator.storage) {
    //         navigator.storage.estimate().then(function (estimate) {
    //           console.log(
    //             `Using5 ${estimate.usage} out of ${estimate.quota} bytes.`
    //           );
    //         });
    //       }
    //       this.cargando("cargando REGION " + nombre);
    //       const dataJ = JSON.parse(ss);
    //       for (const dat of dataJ) {
    //         if ("storage" in navigator && "estimate" in navigator.storage) {
    //           navigator.storage.estimate().then(function (estimate) {
    //             console.log(
    //               `Using6 ${estimate.usage} out of ${estimate.quota} bytes.`
    //             );
    //           });
    //         }
    //         this.establecimientos.push(dat);
    //       }

    //       this.storage.set("establecimientosAll", this.establecimientos);
    //       if ("storage" in navigator && "estimate" in navigator.storage) {
    //         navigator.storage.estimate().then(function (estimate) {
    //           console.log(
    //             `Using7 ${estimate.usage} out of ${estimate.quota} bytes.`
    //           );
    //         });
    //       }
    //       if (cantidadRegiones == count) {
    //         this.loading.dismiss();
    //       }
    //     });


    // this.getDataSet().subscribe((resp) => {
    //   let ss = JSON.stringify(resp, null, 4);
    //   console.log("respuesta API DATASET= " + ss);
    //   const dataJ = JSON.parse(ss);
    //   this.loading.dismiss();
    // });

  }

  getDataSet(regionId) {
    //this.cargando("Descargando Región N° = " + regionId.toString() +"" );
    //const headers = new HttpHeaders().set("Authorization", "").set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.get(
      'https://pssoft.cl/influenzaAviarRest/getSabanaCGIA?regionId=' + regionId + ''//,

      //{ headers: headers }
    );
  }
}


