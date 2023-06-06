import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Storage } from '@ionic/storage';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-descarga',
  templateUrl: './descarga.page.html',
  styleUrls: ['./descarga.page.scss'],
})
export class DescargaPage implements OnInit {

  loading: HTMLIonLoadingElement;


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

  dataConf: any;
  constructor(public storage: Storage, private http: HttpClient, public loadingController: LoadingController) { }

  async ngOnInit() {
    this.getDataSets()
    const { value } = await Preferences.get({ key: 'configuracion' });
    var dataOf = JSON.parse(value);
    this.dataConf = dataOf || undefined;
  }

  async getDataSets() {
    var d1 = await this.storage.get("region_1")
    if (d1 != null)
      this.r1 = true
    var d2 = await this.storage.get("region_2")
    if (d2 != null)
      this.r2 = true
    var d3 = await this.storage.get("region_3")
    if (d3 != null)
      this.r3 = true
    var d4 = await this.storage.get("region_4")
    if (d4 != null)
      this.r4 = true
    var d5 = await this.storage.get("region_5")
    if (d5 != null)
      this.r5 = true
    var d6 = await this.storage.get("region_6")
    if (d6 != null)
      this.r6 = true
    var d7 = await this.storage.get("region_7")
    if (d7 != null)
      this.r7 = true

    var d8 = await this.storage.get("region_8")
    if (d8 != null)
      this.r8 = true

    var d9 = await this.storage.get("region_9")
    if (d9 != null)
      this.r9 = true


    var d10 = await this.storage.get("region_10")
    if (d10 != null)
      this.r10 = true

    var d11 = await this.storage.get("region_11")
    if (d11 != null)
      this.r11 = true

    var d12 = await this.storage.get("region_12")
    if (d12 != null)
      this.r12 = true


    var d13 = await this.storage.get("region_13")
    if (d13 != null)
      this.r13 = true


    var d14 = await this.storage.get("region_14")
    if (d14 != null)
      this.r14 = true

    var d15 = await this.storage.get("region_15")
    if (d15 != null)
      this.r15 = true
    var d16 = await this.storage.get("region_16")
    if (d16 != null)
      this.r16 = true

  }

  async cargando(mensaje) {
    this.loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: mensaje
    });
    await this.loading.present();
  }

  jsonEnvio: any = []
  async orderJsonPost(jsonResp) {
    this.jsonEnvio = [];
    const dataJO = jsonResp || [];

    if (dataJO.length > 0) {
      for await (const i of dataJO) {
         var obj = {
           IdRup: i.IdRup,
           Rup:i.Rup,
           OficinaId:i.OficinaId,
           CoordenadaX:i.CoordenadaX,
           CoordenadaY:i.CoordenadaY,
           Huso:i.Huso,
           Latitud:i.Latitud,
           Longitud:i.Longitud,
           PesoContagio:i.PesoContagio,
           PesoMasaEntrada: i.PesoMasaEntrada,
           PesoMasaSalida: i.PesoMasaSalida,
           NivelVigilancia : i.NivelVigilancia,
           ProtocoloLab: i.ProtocoloLab,
           CantidadNegativosLab:i.CantidadNegativosLab,
           CantidadPositivosLab :i.CantidadPositivosLab,
           ProtocoloPc : i.ProtocoloPc,
           CantidadNegativosPc : i.CantidadNegativosPc,
           CantidadPositivosPc : i.CantidadPositivosPc,
           TodosNegativosLab: i.TodosNegativosLab,
           AlMenosUnPositivoLab:i.AlMenosUnPositivoLab,
           TodosNegativosPc : i.TodosNegativosPc,
           AlMenosUnPositivoPc : i.AlMenosUnPositivoPc,
           CodigoTERubro : i.CodigoTERubro,
           RiesgoMovimiento : i.RiesgoMovimiento,
           TextoRiesgoMovimiento: i.TextoRiesgoMovimiento
         }
         this.jsonEnvio.push(obj);
      }
      return this.jsonEnvio;
    }else{
      return [];
    }
    
  }
  async descargar(regionId) {
    let keye = "region_" + regionId;
    const xL = await this.cargando("Espere, descargando el DataSet de la Region => " + regionId + "");
    this.getDataSet(regionId).subscribe((resp) => {
      let ss = JSON.stringify(resp, null, 4);
      //console.log("respuesta API DATASET= " + ss);
      const dataJ = JSON.parse(ss);

      var dat = this.orderJsonPost(resp);
      
      this.storage.set(keye, dat);

      this.getDataSets()
      this.loading.dismiss();
      
      dataJ.forEach(element => {
        //  console.log("respuesta API= " + ss);

      });


    });
    
  }




  getDataSet(region) { 



    if (this.dataConf == undefined) {
      alert("No existe configuracion previa para descargar el DataSet")
    } else {
     // alert(this.dataConf.fecha)
      var parametros = "region=" + region + "&"
      parametros += "sector=0&"
      parametros += "rup=&fechaDesde=" + this.dataConf.fecha + "&"
      parametros += "cantidadDias=" + this.dataConf.diasAtras + "&"
      parametros += "especie=39&"
      parametros += "enfermedad=79&"
      parametros += "valorAlta=" + this.dataConf.flujoAlto + "&"
      parametros += "valorMediaAlta=" + this.dataConf.flujoMedioAlto + "&"
      parametros += "valorMedia=" + this.dataConf.flujoMedio + "&"
      parametros += "valorBaja=" + this.dataConf.flujoBajo + "&"
      parametros += "valorVigilanciaAlta=" + this.dataConf.vigilanciaAlta + "&"
      parametros += "valorVigilanciaMedia=" + this.dataConf.vigilanciaMedia + "&"
      parametros += "valorVigilanciaBaja=" + this.dataConf.vigilanciaBaja + "&"
      parametros += "predioLeche=" + this.dataConf.predioLeche + "&"
      parametros += "predioCarne=" + this.dataConf.predioCarne + "&"
      parametros += "mataderoCarne=" + this.dataConf.mataderoCarne + "&"
      parametros += "controlAnimalVivo=" + this.dataConf.controlAnimalVivo + "&"
      parametros += "centroRodeo=" + this.dataConf.centroRodeo + "&"
      parametros += "predioCrianza=" + this.dataConf.predioCrianza + "&"
      parametros += "predioCompra=" + this.dataConf.predioCompra + "&"
      parametros += "feriaCompra=" + this.dataConf.feriaCompra + ""
      const headers = new HttpHeaders().set("Authorization", "").set('Content-Type', 'text/plain; charset=utf-8');
      return this.http.get(
        'http://127.0.0.1:5000/api/testa?' + parametros + '',

        { headers: headers }
      );
    }
  }

}
