import { Component } from '@angular/core';
import * as Leaflet from 'leaflet';
import 'leaflet-routing-machine';
import { antPath } from 'leaflet-ant-path';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CheckboxCustomEvent, LoadingController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { Storage } from '@ionic/storage';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  
  map: Leaflet.Map;

  rubroLeche: number = 1;
  rubroCarne: number = 1;
  rubroOtros: number = 1;
  nVigilanciaBaja: number = 1;
  nVigilanciaMedia: number = 1;
  nVigilanciaAlta: number = 1;
  negativos: number = 0;
  positivoPc: number = 1;
  positivoLab: number = 1;
  sinControl: number = 0;
  objtCoordenada: any;
  loading: HTMLIonLoadingElement;
  listaOficinasBDL: any[] = [];
  selectListOficina: any[] = [];

  panelConfiguracion = false;
  region: number = 0;
  regionSelect: any;
  sector: number = 0;
  presentingElement = null;
  jsonConcat;

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
  menuTopShow: boolean = true;
  filtroSanitario: boolean = false;
  filtroFma: boolean = false;
  reproductorFma: boolean = false;
  public progress = 0;

  rup = "";
  nivelTE_Rubro = "";
  flujoFmaIn = "";
  flujoFmaOut = "";
  nivelVigilanciaT = "";
  todoNegativo = "";
  positivoUl = "";
  clasificacionRiesgo = "";
  dataConf: any;
  fechaFma = "";
  calendario: any[] = [];
  flagPressDia: number = 0;
  flagMovPress: number = 0; //1 in 2 out


  constructor(public storage: Storage, private http: HttpClient, public loadingController: LoadingController) { }

  filtroPlay() {
    if (this.reproductorFma) {
      this.reproductorFma = false;

    } else {
      this.reproductorFma = true;
    }
    this.ajusteMapaSize();
   
  }
  menuShow() {
    if (this.menuTopShow) {
      this.menuTopShow = false;

    } else {
      this.menuTopShow = true;
      this.regionSelect = this.region;

    }
    this.ajusteMapaSize();
  
  }
  async filtroSanidadShow() {
    if (this.filtroSanitario) {
      this.filtroSanitario = false;

    } else {
      this.filtroSanitario = true;
    }

    this.ajusteMapaSize();
   
  }
  filtroFmaShow() {
    if (this.filtroFma) {
      this.filtroFma = false;

    } else {
      this.filtroFma = true;
    }

    this.ajusteMapaSize();
   
  }
  ajusteMapaSize() {
    if (this.menuTopShow && this.filtroSanitario){
      document.getElementById("mapId5").style.height = "60%";
      document.getElementById("toolFma").style.height = "60%";
    }
    if (!this.menuTopShow && !this.filtroSanitario){
      document.getElementById("mapId5").style.height = "100%";
      document.getElementById("toolFma").style.height = "100%";
    }
    if (this.menuTopShow && !this.filtroSanitario){
      document.getElementById("mapId5").style.height = "88%";
      document.getElementById("toolFma").style.height = "88%";
    }
    if (!this.menuTopShow && this.filtroSanitario){
      document.getElementById("mapId5").style.height = "78%";
      document.getElementById("toolFma").style.height = "78%";
    }
    if (this.filtroFma) {
      document.getElementById("mapId5").style.width = "78%";
      document.getElementById("mapId5").style.marginLeft = "20%";
      document.getElementById("toolFma").style.width = "20%";
      document.getElementById("toolFma").style.height = "78%";

    } else {
      document.getElementById("mapId5").style.width = "100%";
      document.getElementById("mapId5").style.marginLeft = "0%";
      document.getElementById("toolFma").style.width = "0%";
    }
    if (this.reproductorFma) {
      document.getElementById("mapId5").style.height = "78%";
      document.getElementById("toolFma").style.height = "78%";
    }
  }

  // async crearLineaTiempo(){

  //   var now = new Date(anioF, mesF, diaF);


  //   for (var d = new Date(anioI, mesI, diaI); d <= now; d.setDate(d.getDate() + 1)) {
  // }
 
  async limpiarInformacionRup(){
    this.rup = "";
    this.nivelTE_Rubro = "";
    this.flujoFmaIn = "";
    this.flujoFmaOut = "";
    this.nivelVigilanciaT = "";
    this.todoNegativo = "";
    this.positivoUl = "";
    this.clasificacionRiesgo = "";
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

  async ionViewDidEnter() {
    this.ajusteMapaSize();
    this.getDataSets();
    await Preferences.remove({ key: 'geo' });
    await this.leafletMap(-40.429810703, -72.6997643208, 8);
    this.presentingElement = document.querySelector('.ion-page');

    // const dataJ = await this.storage.get('prediccionRiesgo')
    // this.jsonConcat = dataJ || [];
    // if (this.jsonConcat.length > 0) {
    //   this.jsonMapa();
    // }

    const { value } = await Preferences.get({ key: 'configuracion' });
    var dataOf = JSON.parse(value);
    this.dataConf = dataOf || undefined;

  }

  async configuracionShow() {
    if (this.panelConfiguracion) {
      this.panelConfiguracion = false;

    }
    else {
      this.panelConfiguracion = true;
    }

  }
  async handleChange5(e) {
    //alert(e.target.value)
  }
  async handleChange3(e) {
    //alert(e.target.value)
  }
  async handleChange(e) {
    //alert(e.target.value)
    this.sector = 0;
    this.region = e.target.value;
    await this.getOficinasLocal();
  }

  async handleChange2(e) {
    //alert(e.target.value)
    this.sector = e.target.value;

  }

  async getOficinasLocal() {
    const { value } = await Preferences.get({ key: 'oficinas' });
    var dataOf = JSON.parse(value);
    this.listaOficinasBDL = dataOf || [];

    this.selectListOficina = this.listaOficinasBDL.filter(x => x.regionId == this.region);


  }

  async cargando(mensaje) {
    this.loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: mensaje
    });
    await this.loading.present();
  }

  async onLeche() {
    if (this.rubroLeche == 1) {
      this.rubroLeche = 0;
      document.getElementById('nCA').style.border = "none";
    }
    else {
      this.rubroLeche = 1;
      document.getElementById('nCA').style.border = "5px solid silver";
    }

    await this.jsonMapa();

  }
  async onCarne() {
    if (this.rubroCarne == 1) {
      this.rubroCarne = 0;
      document.getElementById('nCM').style.border = "none";
    }
    else {
      this.rubroCarne = 1;
      document.getElementById('nCM').style.border = "5px solid silver";
    }


    await this.jsonMapa();

  }
  async onOtro() {
    if (this.rubroOtros == 1) {
      this.rubroOtros = 0;
      document.getElementById('nCB').style.border = "none";
    }
    else {
      this.rubroOtros = 1;
      document.getElementById('nCB').style.border = "5px solid silver";
    }


    await this.jsonMapa();

  }

  async onVNB() {

    if (this.nVigilanciaBaja == 1) {
      this.nVigilanciaBaja = 0;
      document.getElementById('nvB').style.border = "none";
    }
    else {
      this.nVigilanciaBaja = 1;
      document.getElementById('nvB').style.border = "5px solid silver";
    }

    await this.jsonMapa();
  }

  async onVNM() {
    if (this.nVigilanciaMedia == 1) {
      this.nVigilanciaMedia = 0;
      document.getElementById('nvM').style.border = "none";
    }
    else {
      this.nVigilanciaMedia = 1;
      document.getElementById('nvM').style.border = "5px solid silver";
    }

    await this.jsonMapa();
  }
  async onVNA() {
    if (this.nVigilanciaAlta == 1) {
      this.nVigilanciaAlta = 0;
      document.getElementById('nvA').style.border = "none";
    }
    else {
      this.nVigilanciaAlta = 1;
      document.getElementById('nvA').style.border = "5px solid silver";
    }

    await this.jsonMapa();
  }
  async onPc() {
    if (this.positivoPc == 1) {
      this.positivoPc = 0;
      document.getElementById('pcS').style.border = "none";
    }
    else {
      this.positivoPc = 1;
      document.getElementById('pcS').style.border = "5px solid silver";
    }

    await this.jsonMapa();
  }
  async onLab() {
    if (this.positivoLab == 1) {
      this.positivoLab = 0;
      document.getElementById('labC').style.border = "none";
    }
    else {
      this.positivoLab = 1;
      document.getElementById('labC').style.border = "5px solid silver";
    }

    await this.jsonMapa();
  }
  async onSin() {
    if (this.sinControl == 1) {
      this.sinControl = 0;
      document.getElementById('sV').style.border = "none";
    }
    else {
      this.sinControl = 1;
      document.getElementById('sV').style.border = "5px solid silver";
    }

    await this.jsonMapa();
  }


  lats: number = 0;
  longt: number = 0;
  async leafletMap(lat, long, zoom) {

    this.map = new Leaflet.Map('mapId5').setView([lat, long], zoom);

    Leaflet.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'SAG-DTI'
    }).addTo(this.map);

    this.map.on('moveend', function (e) {

      const { lat, lng: lon } = e.target.getCenter();
      const zoom = e.target.getZoom();
      //alert(lat)
      //      console.log("Lat, Lon : " + e.target + ", " + e.target.latlng)
      this.objtCoordenada = {
        lat: lat,
        long: lon,
        zoom: zoom
      }
      Preferences.set({
        key: 'geo',
        value: JSON.stringify(this.objtCoordenada)
      });
    });
    var legend = Leaflet.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
      var div = Leaflet.DomUtil.create('div', 'info legend');
      div.innerHTML = '<img alt="legend" src="../assets/img/Legend.png" width="140" height="300" />'
      return div;
    };
    legend.addTo(this.map);
  }


  async pintarPunt(clas, lat, longt, rup, element) {
    //console.log(clas)
    var uno = Leaflet.icon({
      iconUrl: '../assets/img/' + clas + '.png',
      shadowUrl: '../assets/img/' + clas + '.png',
      iconSize: [20, 20], // size of the icon
      shadowSize: [0, 0], // size of the shadow
      iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, 0],  // the same for the shadow
      popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
    });


    const markPoint = Leaflet.marker([lat, longt], { icon: uno });
    markPoint.bindPopup('<p>RUP: ' + rup + '</p>', {
      closeButton: false
    }).on("popupopen", (a) => {
      this.filtroFma = true;
      this.ajusteMapaSize();
      this.rup = "";
      this.nivelTE_Rubro = "";
      this.flujoFmaIn = "";
      this.flujoFmaOut = "";
      this.nivelVigilanciaT = "";
      this.todoNegativo = "";
      this.positivoUl = "";

      this.rup = element.Rup;

      if (element.CodigoTERubro == "149_2" || element.CodigoTERubro == "148_12") {
        return false;
      }

      if (element.PREDICCION == "1")
        this.clasificacionRiesgo = "Negativo con Vigilancia Alta"
      if (element.PREDICCION == "2")
        this.clasificacionRiesgo = "Negativo Bajo Control"
      if (element.PREDICCION == "3")
        this.clasificacionRiesgo = "Riesgo Medio"
      if (element.PREDICCION == "4")
        this.clasificacionRiesgo = "Riesgo Medio Alto"
      if (element.PREDICCION == "5")
        this.clasificacionRiesgo = "Riesgo Alto"
      if (element.PREDICCION == "6")
        this.clasificacionRiesgo = "Riesgo Medio Peligroso"
      if (element.PREDICCION == "7")
        this.clasificacionRiesgo = "Riesgo Peligroso"
      if (element.PREDICCION == "8")
        this.clasificacionRiesgo = "Riesgo Peligroso Alto"
      if (element.PREDICCION == "9")
        this.clasificacionRiesgo = "Muy Riesgoso"
      if (element.PREDICCION == "10")
        this.clasificacionRiesgo = "Sin Protocolos SSA"

      if (element.PesoContagio == "1")
        this.nivelTE_Rubro = "Bajo";
      if (element.PesoContagio == "5")
        this.nivelTE_Rubro = "Medio";
      if (element.PesoContagio == "10")
        this.nivelTE_Rubro = "Alto";

      if (element.PesoMasaEntrada == "1")
        this.flujoFmaIn = "Bajo"
      if (element.PesoMasaEntrada == "3")
        this.flujoFmaIn = "Medio"
      if (element.PesoMasaEntrada == "7")
        this.flujoFmaIn = "Medio Alto"
      if (element.PesoMasaEntrada == "10")
        this.flujoFmaIn = "Alto"

      if (element.PesoMasaSalida == "1")
        this.flujoFmaOut = "Bajo"
      if (element.PesoMasaSalida == "3")
        this.flujoFmaOut = "Medio"
      if (element.PesoMasaSalida == "7")
        this.flujoFmaOut = "Medio Alto"
      if (element.PesoMasaSalida == "10")
        this.flujoFmaOut = "Alto"

      if (element.NivelVigilancia == "1")
        this.nivelVigilanciaT = "Baja"
      if (element.NivelVigilancia == "2")
        this.nivelVigilanciaT = "Media"
      if (element.NivelVigilancia == "3")
        this.nivelVigilanciaT = "Alta"
      if (element.NivelVigilancia == "0")
        this.nivelVigilanciaT = "Sin Protocolo"

      if (element.TodosNegativosLab == "1" || element.TodosNegativosPc == "1")
        this.todoNegativo = "SI";
      if (element.AlMenosUnPositivoPc == "1")
        this.positivoUl = "Sin Confirmación"
      if (element.AlMenosUnPositivoLab == "1")
        this.positivoUl = "Confirmado"
    });

    await this.map.addLayer(markPoint);
  }

  async pintarPuntTransparente(clas, lat, longt, rup) {
    //console.log(clas)
    var uno = Leaflet.icon({
      iconUrl: '../assets/img/' + clas + '_t.png',
      shadowUrl: '../assets/img/' + clas + '_t.png',
      iconSize: [20, 20], // size of the icon
      shadowSize: [0, 0], // size of the shadow
      iconAnchor: [5, 5], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, 0],  // the same for the shadow
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    const markPoint = Leaflet.marker([lat, longt], { icon: uno });
    markPoint.bindPopup('<p>RUP: ' + rup + '</p>');
    await this.map.addLayer(markPoint);
  }

  quitarPunt(clas, lat, longt, rup) {

    const markPoint = Leaflet.marker([lat, longt]);
    markPoint.bindPopup('<p>RUP: ' + rup + '</p>');
    this.map.removeLayer(markPoint);
  }

  async movmientos(latOri, LonOri, LatDes, LonDes, colorLinea, element) {

    // fechaDate: newDate,
    // fechaFma: fechaFmaCh,
    // rupOrigen: x.RupOrigen,
    // latitudOrigen: dataRupOrigen[0].Latitud,
    // longitudOrigen: dataRupOrigen[0].Longitud,
    // riesgoMovimientoOrigen: dataRupOrigen[0].PREDICCION,
    // te_RubroOrigen: dataRupOrigen[0].CodigoTERubro,
    // rupDestino: x.RupDestino,
    // latitudDestino: dataRupDestino[0].Latitud,
    // longitudDestino: dataRupDestino[0].Longitud,
    // riesgoMovimientoDestino: dataRupDestino[0].PREDICCION,
    // te_RubroDestino: dataRupDestino[0].CodigoTERubro,
    // objetoElementOrigen: dataRupOrigen[0],
    // objetoElementDestino: dataRupDestino[0]

    var iconoOri = element.riesgoMovimientoOrigen + "_" + element.te_RubroOrigen;
    var iconoDes = element.riesgoMovimientoDestino + "_" + element.te_RubroDestino;
    var uno = Leaflet.icon({
      iconUrl: '../assets/img/' + iconoOri + '.png',
      shadowUrl: '../assets/img/' + iconoOri + '.png',
      iconSize: [20, 20], // size of the icon
      shadowSize: [0, 0], // size of the shadow
      iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, 0],  // the same for the shadow
      popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
    });
    var dos = Leaflet.icon({
      iconUrl: '../assets/img/' + iconoDes + '.png',
      shadowUrl: '../assets/img/' + iconoDes + '.png',
      iconSize: [20, 20], // size of the icon
      shadowSize: [0, 0], // size of the shadow
      iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, 0],  // the same for the shadow
      popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    const waypoints = [
      Leaflet.latLng(latOri, LonOri),
      Leaflet.latLng(LatDes, LonDes),
    ];
    var rup1 = element.rupOrigen;
    var rup2= element.rupDestino;

    const myPlan = new Leaflet.Routing.Plan(waypoints, {
      addWaypoints: false,
      maxGeocoderTolerance: 20000,
      createMarker: (index: number, waypoint: Leaflet.Routing.Waypoint, numberOfWaypoints: number) => {
        if (waypoint && index > -1 && index < numberOfWaypoints) {

          if (index == 0) {
            const markPoint = Leaflet.marker(waypoint.latLng, { icon: uno });
            markPoint.bindPopup('<p>RUP:' + rup1 + ' </p><p> Fecha FMA: '+element.fechaFma+'</p>', {
              closeButton: false
            }).on("popupopen", (a) => {
              this.movmientoSeleccionado(latOri, LonOri, LatDes, LonDes, '#FA7B09', element)
              this.filtroFma = true;
              this.ajusteMapaSize();
              this.rup = "";
              this.nivelTE_Rubro = "";
              this.flujoFmaIn = "";
              this.flujoFmaOut = "";
              this.nivelVigilanciaT = "";
              this.todoNegativo = "";
              this.positivoUl = "";
              this.clasificacionRiesgo = "RUP Sin Informacion de Clasificacion"
              
              this.rup =rup1;
              
              if (element.objetoElementOrigen.CodigoTERubro == "149_2" || element.objetoElementOrigen.CodigoTERubro == "148_12") {
                this.clasificacionRiesgo = "RUP Feria o Matadero"
                return false;
              }
        
              if (element.objetoElementOrigen.PREDICCION == "1")
                this.clasificacionRiesgo = "Negativo con Vigilancia Alta"
              if (element.objetoElementOrigen.PREDICCION == "2")
                this.clasificacionRiesgo = "Negativo Bajo Control"
              if (element.objetoElementOrigen.PREDICCION == "3")
                this.clasificacionRiesgo = "Riesgo Medio"
              if (element.objetoElementOrigen.PREDICCION == "4")
                this.clasificacionRiesgo = "Riesgo Medio Alto"
              if (element.objetoElementOrigen.PREDICCION == "5")
                this.clasificacionRiesgo = "Riesgo Alto"
              if (element.objetoElementOrigen.PREDICCION == "6")
                this.clasificacionRiesgo = "Riesgo Medio Peligroso"
              if (element.objetoElementOrigen.PREDICCION == "7")
                this.clasificacionRiesgo = "Riesgo Peligroso"
              if (element.objetoElementOrigen.PREDICCION == "8")
                this.clasificacionRiesgo = "Riesgo Peligroso Alto"
              if (element.objetoElementOrigen.PREDICCION == "9")
                this.clasificacionRiesgo = "Muy Riesgoso"
              if (element.objetoElementOrigen.PREDICCION == "10")
                this.clasificacionRiesgo = "Sin Protocolos SSA"
        
              if (element.objetoElementOrigen.PesoContagio == "1")
                this.nivelTE_Rubro = "Bajo";
              if (element.objetoElementOrigen.PesoContagio == "5")
                this.nivelTE_Rubro = "Medio";
              if (element.objetoElementOrigen.PesoContagio == "10")
                this.nivelTE_Rubro = "Alto";
        
              if (element.objetoElementOrigen.PesoMasaEntrada == "1")
                this.flujoFmaIn = "Bajo"
              if (element.objetoElementOrigen.PesoMasaEntrada == "3")
                this.flujoFmaIn = "Medio"
              if (element.objetoElementOrigen.PesoMasaEntrada == "7")
                this.flujoFmaIn = "Medio Alto"
              if (element.objetoElementOrigen.PesoMasaEntrada == "10")
                this.flujoFmaIn = "Alto"
        
              if (element.objetoElementOrigen.PesoMasaSalida == "1")
                this.flujoFmaOut = "Bajo"
              if (element.objetoElementOrigen.PesoMasaSalida == "3")
                this.flujoFmaOut = "Medio"
              if (element.objetoElementOrigen.PesoMasaSalida == "7")
                this.flujoFmaOut = "Medio Alto"
              if (element.objetoElementOrigen.PesoMasaSalida == "10")
                this.flujoFmaOut = "Alto"
        
              if (element.objetoElementOrigen.NivelVigilancia == "1")
                this.nivelVigilanciaT = "Baja"
              if (element.objetoElementOrigen.NivelVigilancia == "2")
                this.nivelVigilanciaT = "Media"
              if (element.objetoElementOrigen.NivelVigilancia == "3")
                this.nivelVigilanciaT = "Alta"
              if (element.objetoElementOrigen.NivelVigilancia == "0")
                this.nivelVigilanciaT = "Sin Protocolo"
        
              if (element.objetoElementOrigen.TodosNegativosLab == "1" || element.objetoElementOrigen.TodosNegativosPc == "1")
                this.todoNegativo = "SI";
              if (element.objetoElementOrigen.AlMenosUnPositivoPc == "1")
                this.positivoUl = "Sin Confirmación"
              if (element.objetoElementOrigen.AlMenosUnPositivoLab == "1")
                this.positivoUl = "Confirmado"
            });
            return markPoint;
          }
          if (index == 1) {
            const markPoint = Leaflet.marker(waypoint.latLng, { icon: dos });
            markPoint.bindPopup('<p>RUP:' + rup1 + ' </p><p> Fecha FMA: '+element.fechaFma+'</p>', {
              closeButton: false
            }).on("popupopen", (a) => {
              this.movmientoSeleccionado(latOri, LonOri, LatDes, LonDes, '#FA7B09', element)
              this.filtroFma = true;
              this.ajusteMapaSize();
              this.rup = "";
              this.nivelTE_Rubro = "";
              this.flujoFmaIn = "";
              this.flujoFmaOut = "";
              this.nivelVigilanciaT = "";
              this.todoNegativo = "";
              this.positivoUl = "";
        
              this.rup =rup1;
              this.clasificacionRiesgo = "RUP Sin Informacion de Clasificacion"
              
              if (element.objetoElementDestino.CodigoTERubro == "149_2" || element.objetoElementDestino.CodigoTERubro == "148_12") {
                this.clasificacionRiesgo = "RUP Feria o Matadero"
                return true;
              }
        
              if (element.objetoElementDestino.PREDICCION == "1")
                this.clasificacionRiesgo = "Negativo con Vigilancia Alta"
              if (element.objetoElementDestino.PREDICCION == "2")
                this.clasificacionRiesgo = "Negativo Bajo Control"
              if (element.objetoElementDestino.PREDICCION == "3")
                this.clasificacionRiesgo = "Riesgo Medio"
              if (element.objetoElementDestino.PREDICCION == "4")
                this.clasificacionRiesgo = "Riesgo Medio Alto"
              if (element.objetoElementDestino.PREDICCION == "5")
                this.clasificacionRiesgo = "Riesgo Alto"
              if (element.objetoElementDestino.PREDICCION == "6")
                this.clasificacionRiesgo = "Riesgo Medio Peligroso"
              if (element.objetoElementDestino.PREDICCION == "7")
                this.clasificacionRiesgo = "Riesgo Peligroso"
              if (element.objetoElementDestino.PREDICCION == "8")
                this.clasificacionRiesgo = "Riesgo Peligroso Alto"
              if (element.objetoElementDestino.PREDICCION == "9")
                this.clasificacionRiesgo = "Muy Riesgoso"
              if (element.objetoElementDestino.PREDICCION == "10")
                this.clasificacionRiesgo = "Sin Protocolos SSA"
        
              if (element.objetoElementDestino.PesoContagio == "1")
                this.nivelTE_Rubro = "Bajo";
              if (element.objetoElementDestino.PesoContagio == "5")
                this.nivelTE_Rubro = "Medio";
              if (element.objetoElementDestino.PesoContagio == "10")
                this.nivelTE_Rubro = "Alto";
        
              if (element.objetoElementDestino.PesoMasaEntrada == "1")
                this.flujoFmaIn = "Bajo"
              if (element.objetoElementDestino.PesoMasaEntrada == "3")
                this.flujoFmaIn = "Medio"
              if (element.objetoElementDestino.PesoMasaEntrada == "7")
                this.flujoFmaIn = "Medio Alto"
              if (element.objetoElementDestino.PesoMasaEntrada == "10")
                this.flujoFmaIn = "Alto"
        
              if (element.objetoElementDestino.PesoMasaSalida == "1")
                this.flujoFmaOut = "Bajo"
              if (element.objetoElementDestino.PesoMasaSalida == "3")
                this.flujoFmaOut = "Medio"
              if (element.objetoElementDestino.PesoMasaSalida == "7")
                this.flujoFmaOut = "Medio Alto"
              if (element.objetoElementDestino.PesoMasaSalida == "10")
                this.flujoFmaOut = "Alto"
        
              if (element.objetoElementDestino.NivelVigilancia == "1")
                this.nivelVigilanciaT = "Baja"
              if (element.objetoElementDestino.NivelVigilancia == "2")
                this.nivelVigilanciaT = "Media"
              if (element.objetoElementDestino.NivelVigilancia == "3")
                this.nivelVigilanciaT = "Alta"
              if (element.objetoElementDestino.NivelVigilancia == "0")
                this.nivelVigilanciaT = "Sin Protocolo"
        
              if (element.objetoElementDestino.TodosNegativosLab == "1" || element.objetoElementDestino.TodosNegativosPc == "1")
                this.todoNegativo = "SI";
              if (element.objetoElementDestino.AlMenosUnPositivoPc == "1")
                this.positivoUl = "Sin Confirmación"
              if (element.objetoElementDestino.AlMenosUnPositivoLab == "1")
                this.positivoUl = "Confirmado"
            });
            return markPoint;
          }


        }
        return false;
      }
    });



    var control = Leaflet.Routing.control({
      plan: myPlan,
      waypoints,
      lineOptions: { styles: [{ color: colorLinea, weight: 2 }], addWaypoints: false },
      fitSelectedRoutes: false,
      draggableWaypoints: false,
      routeWhileDragging: false,
      createMarker: function () {

        return null;
      }
    }).on('routingstart', (a) => {
      console.log(element.fechaFma)
      this.fechaFma = element.fechaFma
    }).addTo(this.map);


    control._container.style.display = "None";

  }

  async movmientoSeleccionado(latOri, LonOri, LatDes, LonDes, colorLinea, element) {

    console.log(JSON.stringify(element))
    var iconoOri = element.riesgoMovimientoOrigen + "_" + element.te_RubroOrigen;
    var iconoDes = element.riesgoMovimientoDestino + "_" + element.te_RubroDestino;

    var uno = Leaflet.icon({
      iconUrl: '../assets/img/' + iconoOri + '.png',
      shadowUrl: '../assets/img/' + iconoOri + '.png',
      iconSize: [20, 20], // size of the icon
      shadowSize: [0, 0], // size of the shadow
      iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, 0],  // the same for the shadow
      popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
    });
    var dos = Leaflet.icon({
      iconUrl: '../assets/img/' + iconoDes + '.png',
      shadowUrl: '../assets/img/' + iconoDes + '.png',
      iconSize: [20, 20], // size of the icon
      shadowSize: [0, 0], // size of the shadow
      iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, 0],  // the same for the shadow
      popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    const waypoints = [
      Leaflet.latLng(latOri, LonOri),
      Leaflet.latLng(LatDes, LonDes),
    ];

    var rup1 = element.rupOrigen;
    var rup2= element.rupDestino;
    const myPlan = new Leaflet.Routing.Plan(waypoints, {
      addWaypoints: false,
      createMarker: (index: number, waypoint: Leaflet.Routing.Waypoint, numberOfWaypoints: number) => {
        if (waypoint && index > -1 && index < numberOfWaypoints) {
          if (index == 0) {
            const markPoint = Leaflet.marker(waypoint.latLng, { icon: uno });
            markPoint.bindPopup('<p>RUP:' + rup1 + ' </p><p> Fecha FMA: '+element.fechaFma+'</p>', {
              closeButton: false
            }).on("popupopen", (a) => {
              this.filtroFma = true;
              this.ajusteMapaSize();
              this.rup = "";
              this.nivelTE_Rubro = "";
              this.flujoFmaIn = "";
              this.flujoFmaOut = "";
              this.nivelVigilanciaT = "";
              this.todoNegativo = "";
              this.positivoUl = "";
              this.clasificacionRiesgo = "RUP Sin Informacion de Clasificacion"
              
              this.rup =rup1;
              
              if (element.objetoElementOrigen.CodigoTERubro == "149_2" || element.objetoElementOrigen.CodigoTERubro == "148_12") {
                this.clasificacionRiesgo = "RUP Feria o Matadero"
                return false;
              }
        
              if (element.objetoElementOrigen.PREDICCION == "1")
                this.clasificacionRiesgo = "Negativo con Vigilancia Alta"
              if (element.objetoElementOrigen.PREDICCION == "2")
                this.clasificacionRiesgo = "Negativo Bajo Control"
              if (element.objetoElementOrigen.PREDICCION == "3")
                this.clasificacionRiesgo = "Riesgo Medio"
              if (element.objetoElementOrigen.PREDICCION == "4")
                this.clasificacionRiesgo = "Riesgo Medio Alto"
              if (element.objetoElementOrigen.PREDICCION == "5")
                this.clasificacionRiesgo = "Riesgo Alto"
              if (element.objetoElementOrigen.PREDICCION == "6")
                this.clasificacionRiesgo = "Riesgo Medio Peligroso"
              if (element.objetoElementOrigen.PREDICCION == "7")
                this.clasificacionRiesgo = "Riesgo Peligroso"
              if (element.objetoElementOrigen.PREDICCION == "8")
                this.clasificacionRiesgo = "Riesgo Peligroso Alto"
              if (element.objetoElementOrigen.PREDICCION == "9")
                this.clasificacionRiesgo = "Muy Riesgoso"
              if (element.objetoElementOrigen.PREDICCION == "10")
                this.clasificacionRiesgo = "Sin Protocolos SSA"
        
              if (element.objetoElementOrigen.PesoContagio == "1")
                this.nivelTE_Rubro = "Bajo";
              if (element.objetoElementOrigen.PesoContagio == "5")
                this.nivelTE_Rubro = "Medio";
              if (element.objetoElementOrigen.PesoContagio == "10")
                this.nivelTE_Rubro = "Alto";
        
              if (element.objetoElementOrigen.PesoMasaEntrada == "1")
                this.flujoFmaIn = "Bajo"
              if (element.objetoElementOrigen.PesoMasaEntrada == "3")
                this.flujoFmaIn = "Medio"
              if (element.objetoElementOrigen.PesoMasaEntrada == "7")
                this.flujoFmaIn = "Medio Alto"
              if (element.objetoElementOrigen.PesoMasaEntrada == "10")
                this.flujoFmaIn = "Alto"
        
              if (element.objetoElementOrigen.PesoMasaSalida == "1")
                this.flujoFmaOut = "Bajo"
              if (element.objetoElementOrigen.PesoMasaSalida == "3")
                this.flujoFmaOut = "Medio"
              if (element.objetoElementOrigen.PesoMasaSalida == "7")
                this.flujoFmaOut = "Medio Alto"
              if (element.objetoElementOrigen.PesoMasaSalida == "10")
                this.flujoFmaOut = "Alto"
        
              if (element.objetoElementOrigen.NivelVigilancia == "1")
                this.nivelVigilanciaT = "Baja"
              if (element.objetoElementOrigen.NivelVigilancia == "2")
                this.nivelVigilanciaT = "Media"
              if (element.objetoElementOrigen.NivelVigilancia == "3")
                this.nivelVigilanciaT = "Alta"
              if (element.objetoElementOrigen.NivelVigilancia == "0")
                this.nivelVigilanciaT = "Sin Protocolo"
        
              if (element.objetoElementOrigen.TodosNegativosLab == "1" || element.objetoElementOrigen.TodosNegativosPc == "1")
                this.todoNegativo = "SI";
              if (element.objetoElementOrigen.AlMenosUnPositivoPc == "1")
                this.positivoUl = "Sin Confirmación"
              if (element.objetoElementOrigen.AlMenosUnPositivoLab == "1")
                this.positivoUl = "Confirmado"
            });
            return markPoint;
          }
          if (index == 1) {
            const markPoint = Leaflet.marker(waypoint.latLng, { icon: dos });
            markPoint.bindPopup('<p>RUP:' + rup2 + ' </p><p> Fecha FMA: '+element.fechaFma+'</p>', {
              closeButton: false
            }).on("popupopen", (a) => {
              this.filtroFma = true;
              this.ajusteMapaSize();
              this.rup = "";
              this.nivelTE_Rubro = "";
              this.flujoFmaIn = "";
              this.flujoFmaOut = "";
              this.nivelVigilanciaT = "";
              this.todoNegativo = "";
              this.positivoUl = "";
        
              this.rup =rup1;
              this.clasificacionRiesgo = "RUP Sin Informacion de Clasificacion"
              
              if (element.objetoElementDestino.CodigoTERubro == "149_2" || element.objetoElementDestino.CodigoTERubro == "148_12") {
                this.clasificacionRiesgo = "RUP Feria o Matadero"
                return true;
              }
        
              if (element.objetoElementDestino.PREDICCION == "1")
                this.clasificacionRiesgo = "Negativo con Vigilancia Alta"
              if (element.objetoElementDestino.PREDICCION == "2")
                this.clasificacionRiesgo = "Negativo Bajo Control"
              if (element.objetoElementDestino.PREDICCION == "3")
                this.clasificacionRiesgo = "Riesgo Medio"
              if (element.objetoElementDestino.PREDICCION == "4")
                this.clasificacionRiesgo = "Riesgo Medio Alto"
              if (element.objetoElementDestino.PREDICCION == "5")
                this.clasificacionRiesgo = "Riesgo Alto"
              if (element.objetoElementDestino.PREDICCION == "6")
                this.clasificacionRiesgo = "Riesgo Medio Peligroso"
              if (element.objetoElementDestino.PREDICCION == "7")
                this.clasificacionRiesgo = "Riesgo Peligroso"
              if (element.objetoElementDestino.PREDICCION == "8")
                this.clasificacionRiesgo = "Riesgo Peligroso Alto"
              if (element.objetoElementDestino.PREDICCION == "9")
                this.clasificacionRiesgo = "Muy Riesgoso"
              if (element.objetoElementDestino.PREDICCION == "10")
                this.clasificacionRiesgo = "Sin Protocolos SSA"
        
              if (element.objetoElementDestino.PesoContagio == "1")
                this.nivelTE_Rubro = "Bajo";
              if (element.objetoElementDestino.PesoContagio == "5")
                this.nivelTE_Rubro = "Medio";
              if (element.objetoElementDestino.PesoContagio == "10")
                this.nivelTE_Rubro = "Alto";
        
              if (element.objetoElementDestino.PesoMasaEntrada == "1")
                this.flujoFmaIn = "Bajo"
              if (element.objetoElementDestino.PesoMasaEntrada == "3")
                this.flujoFmaIn = "Medio"
              if (element.objetoElementDestino.PesoMasaEntrada == "7")
                this.flujoFmaIn = "Medio Alto"
              if (element.objetoElementDestino.PesoMasaEntrada == "10")
                this.flujoFmaIn = "Alto"
        
              if (element.objetoElementDestino.PesoMasaSalida == "1")
                this.flujoFmaOut = "Bajo"
              if (element.objetoElementDestino.PesoMasaSalida == "3")
                this.flujoFmaOut = "Medio"
              if (element.objetoElementDestino.PesoMasaSalida == "7")
                this.flujoFmaOut = "Medio Alto"
              if (element.objetoElementDestino.PesoMasaSalida == "10")
                this.flujoFmaOut = "Alto"
        
              if (element.objetoElementDestino.NivelVigilancia == "1")
                this.nivelVigilanciaT = "Baja"
              if (element.objetoElementDestino.NivelVigilancia == "2")
                this.nivelVigilanciaT = "Media"
              if (element.objetoElementDestino.NivelVigilancia == "3")
                this.nivelVigilanciaT = "Alta"
              if (element.objetoElementDestino.NivelVigilancia == "0")
                this.nivelVigilanciaT = "Sin Protocolo"
        
              if (element.objetoElementDestino.TodosNegativosLab == "1" || element.objetoElementDestino.TodosNegativosPc == "1")
                this.todoNegativo = "SI";
              if (element.objetoElementDestino.AlMenosUnPositivoPc == "1")
                this.positivoUl = "Sin Confirmación"
              if (element.objetoElementDestino.AlMenosUnPositivoLab == "1")
                this.positivoUl = "Confirmado"
            });
            return markPoint;
          }


        }
        return false;
      }
    });



    var control = Leaflet.Routing.control({
      plan: myPlan,
      waypoints,
      lineOptions: { styles: [{ color: colorLinea, weight: 4 }], addWaypoints: false },
      fitSelectedRoutes: false,
      draggableWaypoints: false,
      routeWhileDragging: false,
      createMarker: function () { return null; }
    }).addTo(this.map);

    control._container.style.display = "None";

  }


  async getFmas() {
    if (this.region > 0 && this.region != undefined && this.dataConf != undefined) {
      const xL = await this.cargando("Espere, Buscando Movimientos de Entrada");
      this.getMovimientosIn(this.region, '01-09-2021').subscribe((resp) => {
        let ss = JSON.stringify(resp, null, 4);
        console.log("respuesta API mov in= " + ss);
        const dataJ = JSON.parse(ss);
        this.crearDataSetMovIn(resp, this.region);

        //this.loading.dismiss();
        //  const xL = this.cargando("Espere, Buscando Movimientos");
        this.getMovimientosOut(this.region, '01-09-2021').subscribe((resp2) => {
          let ss = JSON.stringify(resp2, null, 4);
          console.log("respuesta API mov out= " + ss);
          const dataJ = JSON.parse(ss);
          this.crearDataSetMovOut(resp2, this.region);
          //   this.loading.dismiss();

        });

      });
      this.loading.dismiss();
    } else {
      alert("No tiene un DataSet para esa región, por favor descargue uno antes")
    }
  }

  jsonConsolidadoPrediccion = [];
  async consolidarPredicciones() {
    var jsonUnificado;
    const d1 = await this.storage.get('prediccionRiesgo_1')
    var o1 = d1 || [];
    const j1 = o1;
    jsonUnificado = j1
    //this.jsonConsolidadoPrediccion.push(o1);

    const d2 = await this.storage.get('prediccionRiesgo_2')
    var o2 = d2 || [];
    const j2 = o2;
    jsonUnificado = jsonUnificado.concat(j2);
    //this.jsonConsolidadoPrediccion.push(o2);

    const d3 = await this.storage.get('prediccionRiesgo_3')
    var o3 = d3 || [];
    const j3 = o3;
    jsonUnificado = jsonUnificado.concat(j3);
    //this.jsonConsolidadoPrediccion.push(o3);

    const d4 = await this.storage.get('prediccionRiesgo_4')
    var o4 = d4 || [];
    const j4 = o4;
    jsonUnificado = jsonUnificado.concat(j4);
    //this.jsonConsolidadoPrediccion.push(o4);

    const d5 = await this.storage.get('prediccionRiesgo_5')
    var o5 = d5 || [];
    const j5 = o5;
    jsonUnificado = jsonUnificado.concat(j5);
    //this.jsonConsolidadoPrediccion.push(o5);

    const d6 = await this.storage.get('prediccionRiesgo_6')
    var o6 = d6 || [];
    const j6 = o6;
    jsonUnificado = jsonUnificado.concat(j6);
    //this.jsonConsolidadoPrediccion.push(o6);

    const d7 = await this.storage.get('prediccionRiesgo_7')
    var o7 = d7 || [];
    const j7 = o7;
    jsonUnificado = jsonUnificado.concat(j7);
    //this.jsonConsolidadoPrediccion.push(o7);

    const d8 = await this.storage.get('prediccionRiesgo_8')
    var o8 = d8 || [];
    const j8 = o8;
    jsonUnificado = jsonUnificado.concat(j8);
    //this.jsonConsolidadoPrediccion.push(o8);

    const d9 = await this.storage.get('prediccionRiesgo_9')
    var o9 = d9 || [];
    const j9 = o9;
    jsonUnificado = jsonUnificado.concat(j9);
    //this.jsonConsolidadoPrediccion.push(o9);

    const d10 = await this.storage.get('prediccionRiesgo_10')
    var o10 = d10 || [];
    const j10 = o10;
    jsonUnificado = jsonUnificado.concat(j10);
    //this.jsonConsolidadoPrediccion.push(o10);

    const d11 = await this.storage.get('prediccionRiesgo_11')
    var o11 = d11 || [];
    const j11 = o11;
    jsonUnificado = jsonUnificado.concat(j11);
    //this.jsonConsolidadoPrediccion.push(o11);

    const d12 = await this.storage.get('prediccionRiesgo_12')
    var o12 = d12 || [];
    const j12 = o12;
    jsonUnificado = jsonUnificado.concat(j12);
    //this.jsonConsolidadoPrediccion.push(o12);

    const d13 = await this.storage.get('prediccionRiesgo_13')
    var o13 = d13 || [];
    const j13 = o13;
    jsonUnificado = jsonUnificado.concat(j13);
    //this.jsonConsolidadoPrediccion.push(o13);

    const d14 = await this.storage.get('prediccionRiesgo_14')
    var o14 = d14 || [];
    const j14 = o14;
    jsonUnificado = jsonUnificado.concat(j14);
    //this.jsonConsolidadoPrediccion.push(o14);

    const d15 = await this.storage.get('prediccionRiesgo_15')
    var o15 = d15 || [];
    const j15 = o15;
    jsonUnificado = jsonUnificado.concat(j15);
    //this.jsonConsolidadoPrediccion.push(o15);

    const d16 = await this.storage.get('prediccionRiesgo_16')
    var o16 = d16 || [];
    const j16 = o16;
    jsonUnificado = jsonUnificado.concat(j16);
    //this.jsonConsolidadoPrediccion.push(o16);

    await this.storage.set('consolidadoRiesgo', jsonUnificado)

    return true;
  }
  movIn: any[] = [];
  async crearDataSetMovIn(jsonMovIn, region) {
    this.movIn = [];
    await this.consolidarPredicciones();
    const dataJ = await this.storage.get('consolidadoRiesgo')
    var consoli = dataJ || [];


    for await (const x of jsonMovIn) {
      let dateString = x.FechaFma
      let newDate = new Date(dateString);
      const fEs = dateString.split('-');
      var fechaFmaCh = fEs[2] + "-" + fEs[1] + "-" + fEs[0];
      var dataRupOrigen = consoli.filter((f) => f.Rup == x.RupOrigen)
      var dataRupDestino = consoli.filter((f) => f.Rup == x.RupDestino)
      console.log(JSON.stringify(dataRupOrigen[0]))
      if (dataRupOrigen[0] != undefined && dataRupDestino[0] != undefined) {
        var obj = {
          fechaDate: newDate,
          fechaFma: fechaFmaCh,
          rupOrigen: x.RupOrigen,
          latitudOrigen: dataRupOrigen[0].Latitud,
          longitudOrigen: dataRupOrigen[0].Longitud,
          riesgoMovimientoOrigen: dataRupOrigen[0].PREDICCION,
          te_RubroOrigen: dataRupOrigen[0].CodigoTERubro,
          rupDestino: x.RupDestino,
          latitudDestino: dataRupDestino[0].Latitud,
          longitudDestino: dataRupDestino[0].Longitud,
          riesgoMovimientoDestino: dataRupDestino[0].PREDICCION,
          te_RubroDestino: dataRupDestino[0].CodigoTERubro,
          objetoElementOrigen: dataRupOrigen[0],
          objetoElementDestino: dataRupDestino[0]
        }
        this.movIn.push(obj);
        this.storage.set('MovimientosIn_' + region, this.movIn)
      }
      if (dataRupOrigen[0] != undefined && dataRupDestino[0] == undefined) {
        var obj2 = {
          fechaDate: newDate,
          fechaFma: fechaFmaCh,
          rupOrigen: x.RupOrigen,
          latitudOrigen: dataRupOrigen[0].Latitud,
          longitudOrigen: dataRupOrigen[0].Longitud,
          riesgoMovimientoOrigen: dataRupOrigen[0].PREDICCION,
          te_RubroOrigen: dataRupOrigen[0].CodigoTERubro,
          rupDestino: x.RupDestino,
          latitudDestino: x.LatitudDestino,
          longitudDestino: x.LongitudDestino,
          riesgoMovimientoDestino: '20',
          te_RubroDestino: '0_20',
          objetoElementOrigen: dataRupOrigen[0],
          objetoElementDestino: undefined
        }
        this.movIn.push(obj2);
        this.storage.set('MovimientosIn_' + region, this.movIn)
      }
      if (dataRupOrigen[0] == undefined && dataRupDestino[0] != undefined) {
        var obj3 = {
          fechaDate: newDate,
          fechaFma: fechaFmaCh,
          rupOrigen: x.RupOrigen,
          latitudOrigen: x.LatitudOrigen,
          longitudOrigen: x.LongitudOrigen,
          riesgoMovimientoOrigen: '20',
          te_RubroOrigen: '0_20',
          rupDestino: x.RupDestino,
          latitudDestino: dataRupDestino[0].Latitud,
          longitudDestino: dataRupDestino[0].Longitud,
          riesgoMovimientoDestino: dataRupDestino[0].PREDICCION,
          te_RubroDestino: dataRupDestino[0].CodigoTERubro,
          objetoElementOrigen: undefined,
          objetoElementDestino: dataRupDestino[0]
        }
        this.movIn.push(obj3);
        this.storage.set('MovimientosIn_' + region, this.movIn)
      }
      if (dataRupOrigen[0] == undefined && dataRupDestino[0] == undefined) {
        var obj4 = {
          fechaDate: newDate,
          fechaFma: fechaFmaCh,
          rupOrigen: x.RupOrigen,
          latitudOrigen: x.LatitudOrigen,
          longitudOrigen: x.LongitudOrigen,
          riesgoMovimientoOrigen: '20',
          te_RubroOrigen: '0_20',
          rupDestino: x.RupDestino,
          latitudDestino: x.LatitudDestino,
          longitudDestino: x.LongitudDestino,
          riesgoMovimientoDestino: '20',
          te_RubroDestino: '0_20',
          objetoElementOrigen: undefined,
          objetoElementDestino: undefined
        }
        this.movIn.push(obj4);
        this.storage.set('MovimientosIn_' + region, this.movIn)
      }

    }

  }

  movOut: any[] = [];
  async crearDataSetMovOut(jsonMovOut, region) {
    this.movOut = [];
    await this.consolidarPredicciones();
    const dataJ = await this.storage.get('consolidadoRiesgo')
    var consoli = dataJ || [];
    for await (const x of jsonMovOut) {
      let dateString = x.FechaFma
      let newDate = new Date(dateString);
      const fEs = dateString.split('-');
      var fechaFmaCh = fEs[2] + "-" + fEs[1] + "-" + fEs[0];
      var dataRupOrigen = consoli.filter((f) => f.Rup == x.RupOrigen)
      var dataRupDestino = consoli.filter((f) => f.Rup == x.RupDestino)
      console.log(JSON.stringify(dataRupOrigen[0]))
      if (dataRupOrigen[0] != undefined && dataRupDestino[0] != undefined) {
        var obj = {
          fechaDate: newDate,
          fechaFma: fechaFmaCh,
          rupOrigen: x.RupOrigen,
          latitudOrigen: dataRupOrigen[0].Latitud,
          longitudOrigen: dataRupOrigen[0].Longitud,
          riesgoMovimientoOrigen: dataRupOrigen[0].PREDICCION,
          te_RubroOrigen: dataRupOrigen[0].CodigoTERubro,
          rupDestino: x.RupDestino,
          latitudDestino: dataRupDestino[0].Latitud,
          longitudDestino: dataRupDestino[0].Longitud,
          riesgoMovimientoDestino: dataRupDestino[0].PREDICCION,
          te_RubroDestino: dataRupDestino[0].CodigoTERubro,
          objetoElementOrigen: dataRupOrigen[0],
          objetoElementDestino: dataRupDestino[0]
        }
        this.movOut.push(obj);
        this.storage.set('MovimientosOut_' + region, this.movOut)
      }
      if (dataRupOrigen[0] != undefined && dataRupDestino[0] == undefined) {
        var obj2 = {
          fechaDate: newDate,
          fechaFma: fechaFmaCh,
          rupOrigen: x.RupOrigen,
          latitudOrigen: dataRupOrigen[0].Latitud,
          longitudOrigen: dataRupOrigen[0].Longitud,
          riesgoMovimientoOrigen: dataRupOrigen[0].PREDICCION,
          te_RubroOrigen: dataRupOrigen[0].CodigoTERubro,
          rupDestino: x.RupDestino,
          latitudDestino: x.LatitudDestino,
          longitudDestino: x.LongitudDestino,
          riesgoMovimientoDestino: '20',
          te_RubroDestino: '0_20',
          objetoElementOrigen: dataRupOrigen[0],
          objetoElementDestino: undefined
        }
        this.movOut.push(obj2);
        this.storage.set('MovimientosOut_' + region, this.movOut)
      }
      if (dataRupOrigen[0] == undefined && dataRupDestino[0] != undefined) {
        var obj3 = {
          fechaDate: newDate,
          fechaFma: fechaFmaCh,
          rupOrigen: x.RupOrigen,
          latitudOrigen: x.LatitudOrigen,
          longitudOrigen: x.LongitudOrigen,
          riesgoMovimientoOrigen: '20',
          te_RubroOrigen: '0_20',
          rupDestino: x.RupDestino,
          latitudDestino: dataRupDestino[0].Latitud,
          longitudDestino: dataRupDestino[0].Longitud,
          riesgoMovimientoDestino: dataRupDestino[0].PREDICCION,
          te_RubroDestino: dataRupDestino[0].CodigoTERubro,
          objetoElementOrigen: undefined,
          objetoElementDestino: dataRupDestino[0]
        }
        this.movOut.push(obj3);
        this.storage.set('MovimientosOut_' + region, this.movOut)
      }
      if (dataRupOrigen[0] == undefined && dataRupDestino[0] == undefined) {
        var obj4 = {
          fechaDate: newDate,
          fechaFma: fechaFmaCh,
          rupOrigen: x.RupOrigen,
          latitudOrigen: x.LatitudOrigen,
          longitudOrigen: x.LongitudOrigen,
          riesgoMovimientoOrigen: '20',
          te_RubroOrigen: '0_20',
          rupDestino: x.RupDestino,
          latitudDestino: x.LatitudDestino,
          longitudDestino: x.LongitudDestino,
          riesgoMovimientoDestino: '20',
          te_RubroDestino: '0_20',
          objetoElementOrigen: undefined,
          objetoElementDestino: undefined
        }
        this.movOut.push(obj4);
        this.storage.set('MovimientosOut_' + region, this.movOut)
      }

    }

  }
  async limpiarLineas() {
    var x = document.getElementsByClassName("cuboDia");
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].className = "cuboDia pastando";
    }
    await this.jsonMapaTransparente();
  }
  async irMovDiaIn(fecha) {
    if (this.region > 0 && this.region != undefined && this.dataConf != undefined) {

      if (this.flagPressDia == 0) {
        //primera vez
        await this.limpiarLineas();
        this.flagPressDia = 1;
      }
      var el = document.getElementById(fecha);
      el.className = "cuboDia sinAccion";

      await this.getFmas();
      //await this.jsonMapaTransparente();
      if (this.flagMovPress == 1) {
        const dataJ = await this.storage.get('MovimientosIn_' + this.region)
        var dataJO = dataJ || [];
        var dataJF = dataJO.filter((f) => f.fechaFma == fecha)
        var dataFas = dataJF || [];
        if (dataFas.length > 0) {
          for await (const item of dataFas) {
            this.movmientos(item.latitudOrigen, item.longitudOrigen, item.latitudDestino, item.longitudDestino, '#242c81', item)
          }
        }
      }
      if (this.flagMovPress == 2) {
        const dataJ = await this.storage.get('MovimientosOut_' + this.region)
        var dataJO = dataJ || [];
        var dataJF = dataJO.filter((f) => f.fechaFma == fecha)
        var dataFas = dataJF || [];
        if (dataFas.length > 0) {
          for await (const item of dataFas) {
            this.movmientos(item.latitudOrigen, item.longitudOrigen, item.latitudDestino, item.longitudDestino, '#242c81', item)
          }
        }
      }


      //this.loading.dismiss();
    } else {
      alert("No tiene un DataSet para esa región, por favor descargue uno antes")
    }
  }

  async ir() {
    if (this.region > 0 && this.region != undefined && this.dataConf != undefined) {
      await this.limpiarInformacionRup();
      this.flagMovPress = 1
      this.flagPressDia = 0;
      await this.getFmas();
      await this.jsonMapaTransparente();
      this.calendario = [];

      const dataJ = await this.storage.get('MovimientosIn_' + this.region)
      var dataJO = dataJ || [];
      if (dataJO.length > 0) {
        for await (const item of dataJO) {


          const dae = this.calendario.filter(f => f.fechaFmaCal == item.fechaFma)
          var daeD = dae || [];
          if (daeD.length == 0) {
            var fechaDestro = item.fechaFma.split('-');
            var dia = fechaDestro[0];
            var mes = fechaDestro[1];
            var anio = fechaDestro[2].substring(2, 4);
            var ojbf = {
              fechaFmaCal: item.fechaFma,
              fechaPrint: dia + "/" + mes + "/" + anio
            }
            console.log(item.fechaFma)
            this.calendario.push(ojbf);
          }
          this.movmientos(item.latitudOrigen, item.longitudOrigen, item.latitudDestino, item.longitudDestino, '#242c81', item)

        }
      }

      //this.loading.dismiss();
    } else {
      alert("No tiene un DataSet para esa región, por favor descargue uno antes")
    }



  }

  async irOut() {

    if (this.region > 0 && this.region != undefined && this.dataConf != undefined) {
      await this.limpiarInformacionRup();
      this.flagMovPress = 2
      this.flagPressDia = 0;
      await this.getFmas();
      await this.jsonMapaTransparente();
      this.calendario = [];
      const dataJ = await this.storage.get('MovimientosOut_' + this.region)
      var dataJO = dataJ || [];
      if (dataJO.length > 0) {
        for await (const item of dataJO) {
          const dae = this.calendario.filter(f => f.fechaFmaCal == item.fechaFma)
          var daeD = dae || [];
          if (daeD.length == 0) {
            var fechaDestro = item.fechaFma.split('-');
            var dia = fechaDestro[0];
            var mes = fechaDestro[1];
            var anio = fechaDestro[2].substring(2, 4);
            var ojbf = {
              fechaFmaCal: item.fechaFma,
              fechaPrint: dia + "/" + mes + "/" + anio
            }
            console.log(item.fechaFma)
            this.calendario.push(ojbf);
          }
          await this.movmientos(item.latitudOrigen, item.longitudOrigen, item.latitudDestino, item.longitudDestino, '#2B5E08', item)

        }
      }

      //this.loading.dismiss();
    } else {
      alert("No tiene un DataSet para esa región, por favor descargue uno antes")
    }

  }


  async limpiarAll() {
    await this.limpiarInformacionRup();
    const values = await Preferences.get({ key: 'geo' });
    const vart = JSON.parse(values.value);

    this.map.remove();
    if (vart != null)
      await this.leafletMap(vart.lat, vart.long, vart.zoom);
    else
      await this.leafletMap(-40.429810703, -72.6997643208, 8);

    //
  }

  logicaFiltro(element) {
    var swCumple = 0;

    let todosNegativos = 0;

    todosNegativos = element.TodosNegativosLab + element.TodosNegativosPc;

    //dejamos matadero y feria siempre visibles
    if (element.CodigoTERubro == '149_2' || element.CodigoTERubro == '148_12')
      return true;

    if (this.rubroLeche == 1 && element.PesoContagio == 10 && this.nVigilanciaBaja == 1 && element.NivelVigilancia == 1 &&
      todosNegativos > 0)
      swCumple++;
    if (this.rubroLeche == 1 && element.PesoContagio == 10 && this.nVigilanciaMedia == 1 && element.NivelVigilancia == 2 &&
      todosNegativos > 0)
      swCumple++;
    if (this.rubroLeche == 1 && element.PesoContagio == 10 && this.nVigilanciaAlta == 1 && element.NivelVigilancia == 3 &&
      todosNegativos > 0)
      swCumple++;
    if (this.rubroLeche == 1 && element.PesoContagio == 10 && this.positivoPc == 1 && element.AlMenosUnPositivoPc == 1)
      swCumple++;
    if (this.rubroLeche == 1 && element.PesoContagio == 10 && this.positivoLab == 1 && element.AlMenosUnPositivoLab == 1)
      swCumple++;
    if (this.rubroLeche == 1 && element.PesoContagio == 10 && this.sinControl == 1 && element.NivelVigilancia == 0)
      swCumple++;

    if (this.rubroCarne == 1 && element.PesoContagio == 5 && this.nVigilanciaBaja == 1 && element.NivelVigilancia == 1 &&
      todosNegativos > 0)
      swCumple++;
    if (this.rubroCarne == 1 && element.PesoContagio == 5 && this.nVigilanciaMedia == 1 && element.NivelVigilancia == 2 &&
      todosNegativos > 0)
      swCumple++;
    if (this.rubroCarne == 1 && element.PesoContagio == 5 && this.nVigilanciaAlta == 1 && element.NivelVigilancia == 3 &&
      todosNegativos > 0)
      swCumple++;
    if (this.rubroCarne == 1 && element.PesoContagio == 5 && this.positivoPc == 1 && element.AlMenosUnPositivoPc == 1)
      swCumple++;
    if (this.rubroCarne == 1 && element.PesoContagio == 5 && this.positivoLab == 1 && element.AlMenosUnPositivoLab == 1)
      swCumple++;
    if (this.rubroCarne == 1 && element.PesoContagio == 5 && this.sinControl == 1 && element.NivelVigilancia == 0)
      swCumple++;

    if (this.rubroOtros == 1 && element.PesoContagio == 1 && this.nVigilanciaBaja == 1 && element.NivelVigilancia == 1 &&
      todosNegativos > 0)
      swCumple++;
    if (this.rubroOtros == 1 && element.PesoContagio == 1 && this.nVigilanciaMedia == 1 && element.NivelVigilancia == 2 &&
      todosNegativos > 0)
      swCumple++;
    if (this.rubroOtros == 1 && element.PesoContagio == 1 && this.nVigilanciaAlta == 1 && element.NivelVigilancia == 3 &&
      todosNegativos > 0)
      swCumple++;
    if (this.rubroOtros == 1 && element.PesoContagio == 1 && this.positivoPc == 1 && element.AlMenosUnPositivoPc == 1)
      swCumple++;
    if (this.rubroOtros == 1 && element.PesoContagio == 1 && this.positivoLab == 1 && element.AlMenosUnPositivoLab == 1)
      swCumple++;
    if (this.rubroOtros == 1 && element.PesoContagio == 1 && this.sinControl == 1 && element.NivelVigilancia == 0)
      swCumple++;


    // if (this.rubroCarne == 0 && this.rubroOtros == 0 && this.rubroLeche == 0)
    // swCumple++;
    if (swCumple > 0)
      return true

    return false
  }


  async jsonMapa() {

    //await this.limpiarAll();
    if (this.jsonConcat.length > 0) {
      const xL = await this.cargando("Espere, insertando predios categorizados");
    }
    for await (const element of this.jsonConcat) {
      if (this.logicaFiltro(element)) {
        // console.log("fi=> si")
        let icono = element.PREDICCION + "_" + element.CodigoTERubro;
        await this.pintarPunt(icono, element.Latitud, element.Longitud, element.Rup, element);
      } else {
        let icono = element.PREDICCION + "_" + element.PesoContagio;
        this.quitarPunt(icono, element.Latitud, element.Longitud, element.Rup);
      }
    }

    this.loading.dismiss();



  }
  async jsonMapaTransparente() {

    await this.limpiarAll();
    // if (this.jsonConcat.length > 0) {
    //   const xL = await this.cargando("Espere, insertando predios categorizados");
    // }
    // for await (const element of this.jsonConcat) {
    //   if (this.logicaFiltro(element)) {
    //     // console.log("fi=> si")
    //     let icono = element.PREDICCION + "_" + element.CodigoTERubro;
    //     await this.pintarPuntTransparente(icono, element.Latitud, element.Longitud, element.Rup);
    //   } else {
    //     let icono = element.PREDICCION + "_" + element.PesoContagio;
    //     this.quitarPunt(icono, element.Latitud, element.Longitud, element.Rup);
    //   }
    // }

    // this.loading.dismiss();



  }

  async quitarTodo() {

    this.flagU = 0;
    this.jsonConcat = {};
    this.storage.set('prediccionRiesgo', [])
    await this.limpiarInformacionRup();
    await this.limpiarAll();
  }



  flagU = 0;
  async predecirCategoriaRegion() {
    if (this.region > 0 && this.region != undefined) {
      console.log('region_' + this.region)
      //IR A LOCAL
      const dataJ = await this.storage.get('region_' + this.region)
      var dataJO = dataJ || [];
      if (this.sector > 0) {
        dataJO = dataJO.filter(f => f.OficinaId == this.sector);
      }
      if (dataJO.length > 0) {
        this.storage.set('prediccionRiesgo', [])
        const xL = await this.cargando("Espere, la Red Neural esta categorizando la región");
        let jsonPJ = JSON.stringify(dataJO)
        const data = jsonPJ;
        const headers = new HttpHeaders().set("Authorization", "");
        new Promise((resolve) => {
          this.http
            .post(
              'http://127.0.0.1:5000/api/annRiesgoMovBrucelosis',
              data,
              { headers: headers }
            )
            .subscribe(
              (resp) => {
                let ss = JSON.stringify(resp, null, 4);
                //console.log("OOOO => " + ss);
                let dataJ = JSON.parse(ss);
                if (this.flagU == 0) {
                  this.flagU++;
                  this.jsonConcat = dataJ;
                } else {
                  this.jsonConcat = this.jsonConcat.concat(dataJ);
                }
                this.storage.set('prediccionRiesgo_' + this.region + '', this.jsonConcat)
                this.loading.dismiss();
                this.limpiarInformacionRup();
                this.jsonMapa();

                // resolve(true);
              },
              (err) => {
                console.log("ERROR =>" + err);
                //this.storage.clear();
                //  resolve(false);
              }
            );
        });
        // this.getPrediccion(jsonPJ).subscribe((resp) => {
        //   let ss = JSON.stringify(resp, null, 4);
        //   console.log("respuesta API= " + ss);
        //   const dataJ = JSON.parse(ss);
        //   if (this.flagU == 0) {
        //     this.flagU++;
        //     this.jsonConcat = dataJ;
        //   } else {
        //     this.jsonConcat = this.jsonConcat.concat(dataJ);
        //   }
        //   this.loading.dismiss();
        //   this.jsonMapa();
        // });
      } else {
        alert("No tiene un DataSet para esa región, por favor descargue uno antes")
      }

      // Leaflet.tagFilterButton({
      //   data: ['PREDICCION', 'PesoContagio']
      // }).addTo( this.map );


    }

    //   const geojsonLayer = Leaflet.geoJSON(null,{
    //     filter: (feature) => {
    //         const isPredictionChecked = this.checkboxStates.PREDICCION.includes(feature.properties.PREDICCION)

    //         return isPredictionChecked  //only true if both are true
    //     }
    // }).addTo(this.map)

  }





  ionViewWillLeave() {
    //this.map.remove();

  }


  getPrediccion(json) {
    const headers = new HttpHeaders().set("Authorization", "").set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.get(
      'http://127.0.0.1:5000/api/annRiesgoMovBrucelosis?jsona=' + json + '',

      { headers: headers }
    );
  }

  getOficinas() {
    const headers = new HttpHeaders().set("Authorization", "").set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.get(
      'http://127.0.0.1:5000/api/getOficinas',

      { headers: headers }
    );
  }

  getMovimientosIn(regionId, fecha) {
    const headers = new HttpHeaders().set("Authorization", "").set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.get(
      'http://127.0.0.1:5000/api/getMovimientosIn?region=' + regionId + '&fechaDesde=' + fecha + '',

      { headers: headers }
    );
  }

  getMovimientosOut(regionId, fecha) {
    const headers = new HttpHeaders().set("Authorization", "").set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.get(
      'http://127.0.0.1:5000/api/getMovimientosOut?region=' + regionId + '&fechaDesde=' + fecha + '',

      { headers: headers }
    );
  }

}
