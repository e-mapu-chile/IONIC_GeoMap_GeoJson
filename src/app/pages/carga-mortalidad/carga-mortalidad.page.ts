import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as XLSX from "xlsx";
import { Storage } from '@ionic/storage';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-carga-mortalidad',
  templateUrl: './carga-mortalidad.page.html',
  styleUrls: ['./carga-mortalidad.page.scss'],
})
export class CargaMortalidadPage implements OnInit {
  loading: HTMLIonLoadingElement;
  dataPlanilla: [][];
  _cargandoProgress = false;
  _avanceProgress1: number = 0;
  _avanceProgress2: number = 0;
  _avanceProgress3: number = 0;
  _avanceProgress4: number = 0;
  zonasBd: any[] = [];
  objetoJsonMigracion: any[] = [];
  fechaSextaRegion = "";
  fechaQuintaRegion = "";
  fecha7Region = "";
  fechaNubleRegion = "";
  fechaBioBioRegion = "";
  fechaNovenaRegion = "";
  fechaRiosRegion = "";
  fechaLagosRegion = "";
  fechaAysenRegion = "";
  fechaMagallanesRegion = "";
  fechaRMRegion = "";
  fechaCoquimboRegion = "";
  fechaAtacamaRegion = "";
  fechaAntofaRegion = "";
  fechaTarapacaRegion = "";
  fechaAricaRegion = "";
  constructor(private http: HttpClient, private storage: Storage,
    public loadingController: LoadingController) { }

  async ngOnInit() {
    await this.obtenerZonasTodas();
    await this.getDataSets();
  }
  async cargando(mensaje) {
    this.loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: mensaje
    });
    await this.loading.present();
  }



  async onFileChange(evt: any, regionNombre) {
    this._cargandoProgress = true;
    this._avanceProgress1 = 0.0;
    var flagHeader = 0;
    await this.cargando("Cargando mortalidades de la región de " + regionNombre + "");
    var posicionHoja = 0;
    //DEFINIR HOJA EXCEL SEGUN REGION
    console.log(regionNombre)
    if (regionNombre == 'ARICA') {
      posicionHoja = 2
    }
    if (regionNombre == 'ATACAMA') {
      posicionHoja = 2
    }
    if (regionNombre == 'ARAUCANIA') {
      posicionHoja = 2
    }
    if (regionNombre == 'BIOBIO') {
      posicionHoja = 2
    }
    if (regionNombre == 'COQUIMBO') {
      posicionHoja = 2
    }
    if (regionNombre == 'LAGOS') {
      posicionHoja = 2
    }
    if (regionNombre == 'MAULE') {
      posicionHoja = 2
    }
    if (regionNombre == 'METROPOLITANA') {
      posicionHoja = 2
    }
    if(regionNombre == 'ÑUBLE'){
      posicionHoja = 2
    }
    if(regionNombre == 'OHIGGINS'){
      posicionHoja = 2
    }
    if(regionNombre == 'TARAPACA'){
      posicionHoja = 2
    }
    if(regionNombre == 'VALPARAISO'){
      posicionHoja = 1
    }
  

    const target: DataTransfer = <DataTransfer>evt.target;

    if (target.files.length !== 1) throw new Error("Cannot use multiple files");

    const reader: FileReader = new FileReader();

    reader.onload = async (e: any) => {
      // console.log("!2")
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {
        type: "binary",
        cellDates: true,
      });
      console.log(posicionHoja)
      const wsname: string = wb.SheetNames[posicionHoja];
      console.log(wsname)
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      console.log(ws);

      /**
       * datos de la planilla
       */
      this.dataPlanilla = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        dateNF: "DD/MM/YYYY",
      });
      //console.log(this.dataPlanilla);

      /**
       * obtenemos los datos excepto el encabezado o primera fila con nombre NUMERO_DIIO
       */
      let filaH = this.dataPlanilla.slice(0, 1);
      let fila = this.dataPlanilla.slice(1);
      //console.log("FILA =>" + filaH);

      //******* GENERA ESTRUCTURA ******/

      let matrizExcel = "";
      let total = fila.length;
      let countUnoUno = 1;

      this.objetoJsonMigracion = [];

      var especiePos1 = 0;
      var muertoPos1 = 0;
      var eutaPos1 = 0;
      var especiePos2 = 0;
      var muertoPos2 = 0;
      var eutaPos2 = 0;
      var especiePos3 = 0;
      var muertoPos3 = 0;
      var eutaPos3 = 0;
      var especiePos4 = 0;
      var muertoPos4 = 0;
      var eutaPos4 = 0;
      var especiePos5 = 0;
      var muertoPos5 = 0;
      var eutaPos5 = 0;
      var totalCols = 0;
      var indexLugares = "";
      var indexSitios = "";
      var indiceFecha = 0;
      var indiceUsuario = 0;
      var indiceComuna = 0;

      //VER LA PRIMERA FILA CON LAS CABECERAS
      var filaHeader = filaH.toString().split(",");
      totalCols = filaHeader.length;
      console.log("totalCols => " + totalCols);
      var itemH = 0;
      var flagLugares = 0;
      var flagSitios = 0;
      for await (const iterator of filaHeader) {

        if (iterator == "1.-Seleccione la especie")
          especiePos1 = itemH;
        if (iterator == "1.-Total de individuos encontrados muertos")
          muertoPos1 = itemH;
        if (iterator == "1.-Total de individuos eutanasiados")
          eutaPos1 = itemH;
        if (iterator == "2.-Total de individuos eutanasiados")
          eutaPos2 = itemH;
        if (iterator == "2.-Seleccione la 2° especie")
          especiePos2 = itemH;
        if (iterator == "2.-Total de individuos encontrados muertos")
          muertoPos2 = itemH;
        if (iterator == "5.-Seleccione la 5° especie")
          especiePos5 = itemH;
        if (iterator == "5.-Total de individuos encontrados muertos")
          muertoPos5 = itemH;
        if (iterator == "5.-Total de individuos eutanasiados")
          eutaPos5 = itemH;
        if (iterator == "3.-Seleccione la 3° especie")
          especiePos3 = itemH;
        if (iterator == "3.-Total de individuos encontrados muertos")
          muertoPos3 = itemH;
        if (iterator == "3.-Total de individuos eutanasiados")
          eutaPos3 = itemH;
        if (iterator == "4.-Seleccione la 4° especie")
          especiePos4 = itemH;
        if (iterator == "4.-Total de individuos encontrados muertos")
          muertoPos4 = itemH;
        if (iterator == "4.-Total de individuos eutanasiados")
          eutaPos4 = itemH;
        if (iterator == "Email" || iterator == "Correo electrónico")
          indiceUsuario = itemH;
        if (iterator == "Fecha de la visita")
          indiceFecha = itemH;

        // console.log("iterator " + iterator)
        var existeC = iterator.toString().indexOf("comuna");

        if (existeC > -1) {
          indiceComuna = itemH;
        }
        //LUGARES INDICES
        var existeLugar = iterator.toString().indexOf("lugar");

        if (existeLugar > -1) {
          if (flagLugares == 0) {
            indexLugares = itemH.toString();
            flagLugares++;
          }
          else {
            indexLugares += "," + itemH.toString();
          }
        }
        // console.log("indexLugares " + indexLugares)
        //SITIOS INDICES
        var existeSitio = iterator.toString().indexOf("sitio");
        if (existeSitio > -1) {
          if (flagSitios == 0) {
            indexSitios = itemH.toString();
            flagSitios++;
          }
          else {
            indexSitios += "," + itemH.toString();
          }
        }
        // console.log("indexSitios " + indexSitios)
        itemH++;
      }





      fila.forEach(async (value) => {

        //console.log(value.toString());
        //PORCENTAJE PROGRESS
        let porcentaje = (countUnoUno * 100) / total / 100;
        countUnoUno++;
        var s = porcentaje.toString();
        var l = s.length;
        var decimalLength = s.indexOf(".") + 1;
        var numStr = s.substr(0, decimalLength + 2);

        this._avanceProgress1 = Number(numStr);
        // console.log("avanceProgress " + this._avanceProgress1);
        // console.log("!3")
        matrizExcel += value.toString() + ";";
        // console.log(matrizExcel);
        let filaExcelArr = value.toString().split(",");
        // console.log(filaExcelArr);


        var usuario = filaExcelArr[indiceUsuario].split('@')[0];
        var fecha = filaExcelArr[indiceFecha]

        //Convertir en YYYY-MM-DD
        try {


          var fechaFormat = new Date(fecha).toISOString()
          var fechaFor = fechaFormat.split('T')[0];



          var comuna = filaExcelArr[indiceComuna]
          var lugar = "";
          var sitio = "";
          var zonaId = 0;

          var lugaresArray = indexLugares.split(',');
          //  console.log("lugaresArray => "+lugaresArray)
          for (var itt = 0; itt < lugaresArray.length; itt++) {
            //  console.log("filaExcelArr "+itt+" => "+filaExcelArr[itt])
            var lugarA = filaExcelArr[lugaresArray[itt]];
            if (lugarA != "" && lugarA != undefined) {
              //   console.log("lugarA => "+lugarA)
              lugar = lugarA;
              var dataZona = this.zonasBd.filter((f) => f.Primer.toLowerCase() == lugarA.trim().toLowerCase() && f.Comuna.toLowerCase() == comuna.trim().toLowerCase());
              // console.log("dataZona => "+dataZona)
              var zonaD = dataZona || [];
              if (zonaD.length == 0) {
                //NO EXISTE ZONA

              } else {
                //ZONA
                //console.log(zonaD[0].Id);
                zonaId = zonaD[0].Id;
              }
              // console.log("zonaId => "+zonaId)
            }

          }
          var sitiosArray = indexSitios.split(',');
          for (var iat = 0; iat < sitiosArray.length; iat++) {
            var sitioA = filaExcelArr[sitiosArray[iat]];
            if (sitioA != "" && sitioA != undefined) {
              //console.log("sitioA => "+sitioA)
              sitio = sitioA;
            }

          }



          // Especie 1
          var especie1 = filaExcelArr[especiePos1]
          var muertos1 = parseInt(filaExcelArr[muertoPos1])
          var euta1 = parseInt(filaExcelArr[eutaPos1])
          if (especie1 != "" && especie1 != undefined) {
            var objetoMortal = {
              usuario: usuario,
              fechaEvento: fechaFor,
              comuna: comuna,
              zonaId: zonaId,
              lugar: lugar,
              sitio: sitio,
              especie: especie1,
              cantidadMuertos: muertos1,
              cantidadEutanasiados: euta1,
              latitud: '',
              longitud: ''
            }
            // console.log("objetoMortal => "+JSON.stringify(objetoMortal))
            this.objetoJsonMigracion.push(objetoMortal);
            // console.log(JSON.stringify(this.objetoJsonMigracion));
          }


          // ESPECIE 2
          var especie2 = filaExcelArr[especiePos2]
          var muertos2 = parseInt(filaExcelArr[muertoPos2])
          var euta2 = parseInt(filaExcelArr[eutaPos2])
          if (especie2 != "" && especie2 != undefined) {
            var objetoMortal2 = {
              usuario: usuario,
              fechaEvento: fechaFor,
              comuna: comuna,
              zonaId: zonaId,
              lugar: lugar,
              sitio: sitio,
              especie: especie2,
              cantidadMuertos: muertos2,
              cantidadEutanasiados: euta2,
              latitud: '',
              longitud: ''
            }

            this.objetoJsonMigracion.push(objetoMortal2);

          }
          // ESPECIE 3
          var especie3 = filaExcelArr[especiePos3]
          var muertos3 = parseInt(filaExcelArr[muertoPos3])
          var euta3 = parseInt(filaExcelArr[eutaPos3])
          if (especie3 != "" && especie3 != undefined) {
            var objetoMortal3 = {
              usuario: usuario,
              fechaEvento: fechaFor,
              comuna: comuna,
              zonaId: zonaId,
              lugar: lugar,
              sitio: sitio,
              especie: especie3,
              cantidadMuertos: muertos3,
              cantidadEutanasiados: euta3,
              latitud: '',
              longitud: ''
            }

            this.objetoJsonMigracion.push(objetoMortal3);
          }
          // ESPECIE 4
          var especie4 = filaExcelArr[especiePos4]
          var muertos4 = parseInt(filaExcelArr[muertoPos4])
          var euta4 = parseInt(filaExcelArr[eutaPos4])
          if (especie4 != "" && especie4 != undefined) {
            var objetoMortal4 = {
              usuario: usuario,
              fechaEvento: fechaFor,
              comuna: comuna,
              zonaId: zonaId,
              lugar: lugar,
              sitio: sitio,
              especie: especie4,
              cantidadMuertos: muertos4,
              cantidadEutanasiados: euta4,
              latitud: '',
              longitud: ''
            }

            this.objetoJsonMigracion.push(objetoMortal4);
          }
          // ESPECIE 5
          var especie5 = filaExcelArr[especiePos5]
          var muertos5 = parseInt(filaExcelArr[muertoPos5])
          var euta5 = parseInt(filaExcelArr[eutaPos5])
          if (especie5 != "" && especie5 != undefined) {
            var objetoMortal5 = {
              usuario: usuario,
              fechaEvento: fechaFor,
              comuna: comuna,
              zonaId: zonaId,
              lugar: lugar,
              sitio: sitio,
              especie: especie5,
              cantidadMuertos: muertos5,
              cantidadEutanasiados: euta5,
              latitud: '',
              longitud: ''
            }

            this.objetoJsonMigracion.push(objetoMortal5);

          }
          console.log(JSON.stringify(this.objetoJsonMigracion));
        } catch {
          console.log("ERROR onvertir en YYYY-MM-DD " + fecha + "");
        }
      });

      // enviar al servidor
      const doJg = JSON.stringify(this.objetoJsonMigracion);
      const data = { objEvento: doJg }
      const headers = new HttpHeaders().set("Authorization", '');
      return new Promise((resolve) => {
        this.http
          .post(
            'https://pssoft.cl/influenzaAviarrest/nuevoEventoMortalidad',
            data,
            { headers: headers }
          )
          .subscribe(
            async (resp) => {
              console.log(resp);
              var d_object = new Date();
              d_object.setTime(d_object.getTime() - d_object.getTimezoneOffset() * 60 * 1000);
              console.log(d_object.toISOString());
              await this.storage.set("fecha" + regionNombre + "", d_object.toISOString());
              await this.getDataSets();
              this.loading.dismiss();

              //  resolve(true);
            },
            async (err) => {
              console.log("ERROR =>" + JSON.stringify(err));
              var d_object = new Date();
              d_object.setTime(d_object.getTime() - d_object.getTimezoneOffset() * 60 * 1000);
              console.log(d_object.toISOString());

              await this.storage.set("fecha" + regionNombre + "", d_object.toISOString());
              await this.getDataSets();
              this.loading.dismiss();

              //   resolve(false);
            }
          );
      });



    };

    reader.readAsBinaryString(target.files[0]);

  }




  async getDataSets() {
    var d1 = await this.storage.get("fechaOHIGGINS")
    if (d1 != null) {
      var d = d1.split('T');
      var h = d[1].split('.');

      this.fechaSextaRegion = d[0] + ' ' + h[0];
    }
    var d2 = await this.storage.get("fechaVALPARAISO")
    if (d2 != null) {
      var d = d2.split('T');
      var h = d[1].split('.');

      this.fechaQuintaRegion = d[0] + ' ' + h[0];
    }
    var d3 = await this.storage.get("fechaMAULE")
    if (d3 != null) {
      var d = d3.split('T');
      var h = d[1].split('.');

      this.fecha7Region = d[0] + ' ' + h[0];
    }
    var d4 = await this.storage.get("fechaÑUBLE")
    if (d4 != null) {
      var d = d4.split('T');
      var h = d[1].split('.');

      this.fechaNubleRegion = d[0] + ' ' + h[0];
    }
    var d5 = await this.storage.get("fechaBIOBIO")
    if (d5 != null) {
      var d = d5.split('T');
      var h = d[1].split('.');

      this.fechaBioBioRegion = d[0] + ' ' + h[0];
    }
    var d6 = await this.storage.get("fechaARAUCANIA")
    if (d6 != null) {
      var d = d6.split('T');
      var h = d[1].split('.');

      this.fechaNovenaRegion = d[0] + ' ' + h[0];
    }
    var d7 = await this.storage.get("fechaRIOS")
    if (d7 != null) {
      var d = d7.split('T');
      var h = d[1].split('.');

      this.fechaRiosRegion = d[0] + ' ' + h[0];
    }
    var d8 = await this.storage.get("fechaLAGOS")
    if (d8 != null) {
      var d = d8.split('T');
      var h = d[1].split('.');

      this.fechaLagosRegion = d[0] + ' ' + h[0];
    }
    var d9 = await this.storage.get("fechaAYSEN")
    if (d9 != null) {
      var d = d9.split('T');
      var h = d[1].split('.');

      this.fechaAysenRegion = d[0] + ' ' + h[0];
    }
    var d10 = await this.storage.get("fechaMAGALLANES")
    if (d10 != null) {
      var d = d10.split('T');
      var h = d[1].split('.');

      this.fechaMagallanesRegion = d[0] + ' ' + h[0];
    }
    var d11 = await this.storage.get("fechaMETROPOLITANA")
    if (d11 != null) {
      var d = d11.split('T');
      var h = d[1].split('.');

      this.fechaRMRegion = d[0] + ' ' + h[0];
    }
    var d12 = await this.storage.get("fechaCOQUIMBO")
    if (d12 != null) {
      var d = d12.split('T');
      var h = d[1].split('.');

      this.fechaCoquimboRegion = d[0] + ' ' + h[0];
    }
    var d13 = await this.storage.get("fechaATACAMA")
    if (d13 != null) {
      var d = d13.split('T');
      var h = d[1].split('.');

      this.fechaAtacamaRegion = d[0] + ' ' + h[0];
    }
    var d14 = await this.storage.get("fechaANTOFAGASTA")
    if (d14 != null) {
      var d = d14.split('T');
      var h = d[1].split('.');

      this.fechaAntofaRegion = d[0] + ' ' + h[0];
    }
    var d15 = await this.storage.get("fechaTARAPACA")
    if (d15 != null) {
      var d = d15.split('T');
      var h = d[1].split('.');

      this.fechaTarapacaRegion = d[0] + ' ' + h[0];
    }
    var d16 = await this.storage.get("fechaARICA")
    if (d16 != null) {
      var d = d16.split('T');
      var h = d[1].split('.');

      this.fechaAricaRegion = d[0] + ' ' + h[0];
    }




  }
  async obtenerZonasTodas() {
    this.getZonasTodas().subscribe((resp) => {
      let ss = JSON.stringify(resp, null, 4);
      //console.log("respuesta API DATASET= " + ss);
      const dataJ = JSON.parse(ss);
      // console.log(dataJ.zonas )
      this.zonasBd = dataJ.zonas || [];


    });
  }
  getZonasTodas() {
    return this.http.get(
      ' https://pssoft.cl/influenzaAviarrest/getTodasZonas'//,
      //{ headers: headers }
    );
  }


}
