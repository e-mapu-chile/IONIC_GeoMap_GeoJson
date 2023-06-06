import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Storage } from '@ionic/storage';
import { LoadingController } from '@ionic/angular';
import * as XLSX from "xlsx";

// var utm = require('utm')

@Component({
  selector: 'app-pivote-uno',
  templateUrl: './pivote-uno.page.html',
  styleUrls: ['./pivote-uno.page.scss'],
})
export class PivoteUnoPage implements OnInit {
  loading: HTMLIonLoadingElement;
  establecimientos: any[] = [];

  r1: boolean = false;
  r2: boolean = false;
  r3: boolean = false;
  r4: boolean = false;
  r5: boolean = false;
  r6: boolean = false;
  r7: boolean = false;
  r8: boolean = false;
  r9: boolean = false;
  r10: boolean = false;
  r11: boolean = false;
  r12: boolean = false;
  r13: boolean = false;
  r14: boolean = false;
  r15: boolean = false;
  r16: boolean = false;


  constructor(private http: HttpClient,
    public loadingController: LoadingController,
    private storage: Storage) { }

  async cargando(mensaje) {
    this.loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: mensaje
    });
    await this.loading.present();
  }

  async ngOnInit() {
    await this.getDataSets();
  }

  async descargarSabanaExcel() {
    /* generate worksheet */
    let analisisXls = [
      {
        Categoria_Especie: "",
        Nombre_Muestra: "",
        Cantidad_Muestra_POOL: 0,
        Tipo_Identificacion: "",
        Identificacion: "",
        Edad: 0,
        Medida_Edad: "",
        Rup_Origen: "",
      },
    ];


    var lista: any[] = [];

    var d1 = await this.storage.get("ExcelPivote_1")
    if (d1 != null) {
      lista = lista.concat(d1)
      lista.push(lista)
    }


    var d2 = await this.storage.get("ExcelPivote_2")
    if (d2 != null) {
      lista = lista.concat(d2)
      lista.push(lista)
    }

    var d3 = await this.storage.get("ExcelPivote_3")
    if (d3 != null) {
      lista = lista.concat(d3)
      lista.push(lista)
    }
    var d4 = await this.storage.get("ExcelPivote_4")
    if (d4 != null) {
      lista = lista.concat(d4)
      lista.push(lista)
    }
    var d5 = await this.storage.get("ExcelPivote_5")
    if (d5 != null) {
      lista = lista.concat(d5)
      lista.push(lista)
    }
    var d6 = await this.storage.get("ExcelPivote_6")
    if (d6 != null) {
      lista = lista.concat(d6)
      lista.push(lista)
    }
    var d7 = await this.storage.get("ExcelPivote_7")
    if (d7 != null) {
      lista = lista.concat(d7)
      lista.push(lista)
    }

    var d8 = await this.storage.get("ExcelPivote_8")
    if (d8 != null) {
      lista = lista.concat(d8)
      lista.push(lista)
    }

    var d9 = await this.storage.get("ExcelPivote_9")
    if (d9 != null) {
      lista = lista.concat(d9)
      lista.push(lista)
    }


    var d10 = await this.storage.get("ExcelPivote_10")
    if (d10 != null) {
      lista = lista.concat(d10)
      lista.push(lista)
    }

    var d11 = await this.storage.get("ExcelPivote_11")
    if (d11 != null) {
      lista = lista.concat(d11)
      lista.push(lista)
    }

    var d12 = await this.storage.get("ExcelPivote_12")
    if (d12 != null) {
      lista = lista.concat(d12)
      lista.push(lista)
    }


    var d13 = await this.storage.get("ExcelPivote_13")
    if (d13 != null) {
      lista = lista.concat(d13)
      lista.push(lista)
    }


    var d14 = await this.storage.get("ExcelPivote_14")
    if (d14 != null) {
      lista = lista.concat(d14)
      lista.push(lista)
    }

    var d15 = await this.storage.get("ExcelPivote_15")
    if (d15 != null) {
      lista = lista.concat(d15)
      lista.push(lista)
    }
    var d16 = await this.storage.get("ExcelPivote_16")
    if (d16 != null) {
      lista = lista.concat(d16)
      lista.push(lista)
    }



    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    var analisisL = []

    lista.forEach(e => {
      // console.log(e)
      // var lalo = utm.toLatLon(e.CoordenadaX, e.CoordenadaY, e.Huso, 's')
      // console.log(lalo)
      let obj = {
        protocoloId: e.protocoloId,
        Denuncia: e.Denuncia,
        FechaTomaMuestra: e.FechaTomaMuestra,
        anio: e.anio,
        veiti2: e.D_2022,
        veiti3: e.D_2023,
        fechaRecepcion: e.fechaRecepcion,
        fechaResultado: e.fechaResultado,
        FechaCierre: e.FechaCierre,
        EstadoProtocolo: e.EstadoProtocolo,
        EstadoMuestra: e.EstadoMuestra,
        RupTomaMuestra: e.RupTomaMuestra,
        RupOrigen: e.RupOrigen,
        Nombre: e.Nombre,
        CoordenadaX: e.CoordenadaX,
        CoordenadaY: e.CoordenadaY,
        Huso: e.Huso,
        Zona: e.ZONA,
        Region: e.RegionIdOrigen,
        Objetivo: e.Objetivo,
        Laboratorio: e.Laboratorio,
        Especie: e.Especie,
        Categoria: e.Categoria,
        Tubo: e.Tubo,
        IdentificacionAnimal: e.IdentificacionAnimal,
        ContieneEnfermedad: e.ContieneEnfermedad,
        Torula_cloacal: e.Torula_cloacal,
        Torula_traqueal: e.Torula_traqueal,
        Torula_fecal: e.Torula_fecal,
        Suero: e.Suero,
        Heces: e.Heces,
        Organos: e.Organos,
        Cultivo_bacteriologico: e.Cultivo_bacteriologico,
        RTPCR_Tiempo_Real_IA_Matrix_Tipo_A_aves_silvestres: e.RTPCR_Tiempo_Real_IA_Matrix_Tipo_A_aves_silvestres,
        RTPCR_Tiempo_Real_IA_Matrix_Tipo_A_aves_corral: e.RTPCR_Tiempo_Real_IA_Matrix_Tipo_A_aves_corral,
        RTPCR_Tiempo_Real_Influenza_H5: e.RTPCR_Tiempo_Real_Influenza_H5,
        ELISA_Multiespecie_Competencia: e.ELISA_Multiespecie_Competencia,
        Secuenciacion_analisis_filogenético: e.Secuenciacion_analisis_filogenético
      }

      analisisL.push(obj)
    });

  //  console.log(analisisL)
    const analisisXlsa: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      analisisL
    );
    XLSX.utils.book_append_sheet(wb, analisisXlsa, "Analisis");

    for (var i in wb) {
      console.log(wb[i]);
    
      // if (typeof wb[i] != 'object') continue;
      // let cell = XLSX.utils.decode_cell(i);
      // console.log(cell)
    }

    /* save to file */
    let nombreArchivo =
      "SabanaInfluenzaAviarPivoteV1_" + new Date().toISOString() + ".xlsx";
    XLSX.writeFile(wb, nombreArchivo);

  }

  async getDataSets() {
    var d1 = await this.storage.get("ExcelPivote_1")
    if (d1 != null)
      this.r1 = true
    var d1 = await this.storage.get("ExcelPivote_1")
    if (d1 != null)
      this.r1 = true
    var d2 = await this.storage.get("ExcelPivote_2")
    if (d2 != null)
      this.r2 = true
    var d3 = await this.storage.get("ExcelPivote_3")
    if (d3 != null)
      this.r3 = true
    var d4 = await this.storage.get("ExcelPivote_4")
    if (d4 != null)
      this.r4 = true
    var d5 = await this.storage.get("ExcelPivote_5")
    if (d5 != null)
      this.r5 = true
    var d6 = await this.storage.get("ExcelPivote_6")
    if (d6 != null)
      this.r6 = true
    var d7 = await this.storage.get("ExcelPivote_7")
    if (d7 != null)
      this.r7 = true

    var d8 = await this.storage.get("ExcelPivote_8")
    if (d8 != null)
      this.r8 = true

    var d9 = await this.storage.get("ExcelPivote_9")
    if (d9 != null)
      this.r9 = true


    var d10 = await this.storage.get("ExcelPivote_10")
    if (d10 != null)
      this.r10 = true

    var d11 = await this.storage.get("ExcelPivote_11")
    if (d11 != null)
      this.r11 = true

    var d12 = await this.storage.get("ExcelPivote_12")
    if (d12 != null)
      this.r12 = true


    var d13 = await this.storage.get("ExcelPivote_13")
    if (d13 != null)
      this.r13 = true


    var d14 = await this.storage.get("ExcelPivote_14")
    if (d14 != null)
      this.r14 = true

    var d15 = await this.storage.get("ExcelPivote_15")
    if (d15 != null)
      this.r15 = true
    var d16 = await this.storage.get("ExcelPivote_16")
    if (d16 != null)
      this.r16 = true

  }

  async eliminarDescargas() {
    await this.storage.set("ExcelPivote_1", null)
    await this.storage.set("ExcelPivote_2", null)
    await this.storage.set("ExcelPivote_3", null)
    await this.storage.set("ExcelPivote_4", null)
    await this.storage.set("ExcelPivote_5", null)
    await this.storage.set("ExcelPivote_6", null)
    await this.storage.set("ExcelPivote_7", null)
    await this.storage.set("ExcelPivote_8", null)
    await this.storage.set("ExcelPivote_9", null)
    await this.storage.set("ExcelPivote_10", null)
    await this.storage.set("ExcelPivote_11", null)
    await this.storage.set("ExcelPivote_12", null)
    await this.storage.set("ExcelPivote_13", null)
    await this.storage.set("ExcelPivote_14", null)
    await this.storage.set("ExcelPivote_15", null)
    await this.storage.set("ExcelPivote_16", null)
    this.r1 = false;
    this.r2 = false;
    this.r3 = false;
    this.r4 = false;
    this.r5 = false;
    this.r6 = false;
    this.r7 = false;
    this.r8 = false;
    this.r9 = false;
    this.r10 = false;
    this.r11 = false;
    this.r12 = false;
    this.r13 = false;
    this.r14 = false;
    this.r15 = false;
    this.r16 = false;
  }

  async descargar(regionId) {
    // let keye = "region_" + regionId;
    const xL = await this.cargando("Espere, descargando el DataSet " + regionId.toString());
    const estabAll = await this.storage.get("ExcelPivote_" + regionId.toString());
    this.establecimientos = estabAll || [];
    try {
      this.getDataSet(regionId).subscribe((resp) => {
        let ss = JSON.stringify(resp, null, 4);
        console.log("respuesta API DATASET= " + ss);
        const dataJ = JSON.parse(ss);
        this.storage.set("ExcelPivote_" + regionId.toString(), dataJ.sabana);
        this.getDataSets();
        this.loading.dismiss();
      });


    } catch (sfgs) {
      this.loading.dismiss();
    }
    await this.getDataSets();
  }

  getDataSet(regionId) {
    //this.cargando("Descargando Región N° = " + regionId.toString() +"" );
    const headers = new HttpHeaders().set("Authorization", "").set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.get<any>(
      'https://pssoft.cl/influenzaAviarRest/getSabanaCGIA?regionId=' + regionId + '',

      { headers: headers }
    );
  }

}
