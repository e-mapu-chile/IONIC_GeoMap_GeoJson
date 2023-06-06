import { Component } from '@angular/core';
import * as Leaflet from 'leaflet';
import 'leaflet-routing-machine';
import { antPath } from 'leaflet-ant-path';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CheckboxCustomEvent, LoadingController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  map: Leaflet.Map;
  region: number;
  presentingElement = null;
  jsonConcat;
  constructor(private http: HttpClient, public loadingController: LoadingController) { }

  async ionViewDidEnter() {
    await Preferences.remove({ key: 'geo' });
    await this.leafletMap(-40.429810703, -72.6997643208, 5);

    this.presentingElement = document.querySelector('.ion-page');

  }
  rubroLeche: number = 0;
  rubroCarne: number = 0;
  rubroOtros: number = 0;
  nVigilanciaBaja: number = 0;
  nVigilanciaMedia: number = 0;
  nVigilanciaAlta: number = 0;
  negativos: number = 0;
  positivoPc: number = 0;
  positivoLab: number = 0;
  sinControl: number = 0;
  objtCoordenada: any;
  loading: HTMLIonLoadingElement;
  async cargando(mensaje) {
    this.loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: mensaje
    });
    await this.loading.present();
  }

  async onLeche(event: Event) {
    const ev = event as CheckboxCustomEvent;

    if (ev.detail.checked == false) {
      this.rubroLeche = 0;
    }
    else {
      this.rubroLeche = 1;
    }

    await this.jsonMapa();

  }
  async onCarne(event: Event) {
    const ev = event as CheckboxCustomEvent;

    if (ev.detail.checked == false) {
      this.rubroCarne = 0;
    }
    else {
      this.rubroCarne = 1;
    }
    await this.jsonMapa();

  }
  async onOtro(event: Event) {
    const ev = event as CheckboxCustomEvent;
    if (ev.detail.checked == false) {
      this.rubroOtros = 0;
    }
    else {
      this.rubroOtros = 1;
    }
    await this.jsonMapa();

  }

  async onVNB(event: Event) {
    const ev = event as CheckboxCustomEvent;
    if (ev.detail.checked == false) {
      this.nVigilanciaBaja = 0;
    }
    else {
      this.nVigilanciaBaja = 1;
    }
    await this.jsonMapa();
  }

  async onVNM(event: Event) {
    const ev = event as CheckboxCustomEvent;
    if (ev.detail.checked == false) {
      this.nVigilanciaMedia = 0;
    }
    else {
      this.nVigilanciaMedia = 1;
    }
    await this.jsonMapa();
  }
  async onVNA(event: Event) {
    const ev = event as CheckboxCustomEvent;
    if (ev.detail.checked == false) {
      this.nVigilanciaAlta = 0;
    }
    else {
      this.nVigilanciaAlta = 1;
    }
    await this.jsonMapa();
  }
  async onPc(event: Event) {
    const ev = event as CheckboxCustomEvent;
    if (ev.detail.checked == false) {
      this.positivoPc = 0;
    }
    else {
      this.positivoPc = 1;
    }
    await this.jsonMapa();
  }
  async onLab(event: Event) {
    const ev = event as CheckboxCustomEvent;
    if (ev.detail.checked == false) {
      this.positivoLab = 0;
    }
    else {
      this.positivoLab = 1;
    }
    await this.jsonMapa();
  }
  async onSin(event: Event) {
    const ev = event as CheckboxCustomEvent;
    if (ev.detail.checked == false) {
      this.sinControl = 0;
    }
    else {
      this.sinControl = 1;
    }
    await this.jsonMapa();
  }


  lats: number = 0;
  longt: number = 0;
  async leafletMap(lat, long, zoom) {

    this.map = new Leaflet.Map('mapId4').setView([lat, long], zoom);

    Leaflet.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'SAG-DTI'
    }).addTo(this.map);

    this.map.on('moveend', function (e) {

      const { lat, lng: lon } = e.target.getCenter();
      const zoom = e.target.getZoom();
      //alert(lat)
      console.log("Lat, Lon : " + e.target + ", " + e.target.latlng)

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

    var legend = Leaflet.control({ position: 'bottomleft' });
    legend.onAdd = function (map) {

      var div = Leaflet.DomUtil.create('div', 'info legend');

      var elemento = document.getElementById('panelTool');

      div.innerHTML = elemento.innerHTML;
      return div;
    };
    legend.addTo(this.map);

    var legend = Leaflet.control({ position: 'bottomright' });
    legend.onAdd = function (map) {

      var div = Leaflet.DomUtil.create('div', 'info legend');

      div.innerHTML = '<img alt="legend" src="../assets/img/Legend.png" width="110" height="250" />'
      return div;
    };
    legend.addTo(this.map);

  }

  pintarPunt(clas, lat, longt, rup) {
    var uno = Leaflet.icon({
      iconUrl: '../assets/img/' + clas + '.png',
      shadowUrl: '../assets/img/' + clas + '.png',
      iconSize: [30, 30], // size of the icon
      shadowSize: [0, 0], // size of the shadow
      iconAnchor: [10, 20], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, 0],  // the same for the shadow
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    const markPoint = Leaflet.marker([lat, longt], { icon: uno });
    markPoint.bindPopup('<p>RUP: ' + rup + '</p>');
    this.map.addLayer(markPoint);
  }

  quitarPunt(clas, lat, longt, rup) {

    const markPoint = Leaflet.marker([lat, longt]);
    markPoint.bindPopup('<p>RUP: ' + rup + '</p>');
    this.map.removeLayer(markPoint);
  }

  async movmientos(latOri, LonOri, LatDes, LonDes) {
    const waypoints = [
      Leaflet.latLng(latOri, LonOri),
      Leaflet.latLng(LatDes, LonDes),
    ];

    const myPlan = new Leaflet.Routing.Plan(waypoints, {
      addWaypoints: false,
      createMarker: (index: number, waypoint: Leaflet.Routing.Waypoint, numberOfWaypoints: number) => {
        if (waypoint && index > -1 && index < numberOfWaypoints) {
          return Leaflet.marker(waypoint.latLng);
        }
        return false;
      }
    });


    var control = Leaflet.Routing.control({
      plan: myPlan,
      waypoints,
      lineOptions: { styles: [{ color: '#242c81', weight: 3 }], addWaypoints: false },
      fitSelectedRoutes: false,
      draggableWaypoints: false,
      routeWhileDragging: false,
      createMarker: function () { return null; }
    }).addTo(this.map);

    control._container.style.display = "None";

  }


  async ir() {
    var li = [[
      [-40.6283026194, -73.0956261304], [-40.7438799816, -72.4596208509]], [
      [-41.3317832031, -73.2598702905], [-41.030778559, -73.1469585094]]]

    this.movmientos(-40.6283026194, -73.0956261304, -40.7438799816, -72.4596208509)
    this.movmientos(-41.3317832031, -73.2598702905, -41.030778559, -73.1469585094)

  }


  async limpiarAll() {

    const values = await Preferences.get({ key: 'geo' });
    const vart = JSON.parse(values.value);

    this.map.remove();
    if (vart != null)
      await this.leafletMap(vart.lat, vart.long, vart.zoom);
    else
      await this.leafletMap(-40.429810703, -72.6997643208, 4);

    //
  }

  logicaFiltro(element) {
    var swCumple = 0;

    let todosNegativos = 0;

    todosNegativos = element.TodosNegativosLab + element.TodosNegativosPc;


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

    await this.limpiarAll();
    if (this.jsonConcat.length > 0) {
      const xL = await this.cargando("Espere, insertando predios categorizados");
    }
    this.jsonConcat.forEach(element => {
      //  console.log("fi=>" + this.logicaFiltro(element))
      if (this.logicaFiltro(element)) {
        let icono = element.PREDICCION + "_" + element.PesoContagio;
        this.pintarPunt(icono, element.Latitud, element.Longitud, element.RUP);
      } else {
        let icono = element.PREDICCION + "_" + element.PesoContagio;
        this.quitarPunt(icono, element.Latitud, element.Longitud, element.RUP);
      }

    });
    this.loading.dismiss();



  }

  async quitarTodo() {

    this.flagU = 0;
    this.jsonConcat = {};
    await this.limpiarAll();
  }
  flagU = 0;
  async predecirCategoriaRegion() {
    if (this.region > 0 && this.region != undefined) {
      const xL = await this.cargando("Espere, la Red Neural esta categorizando la región");
      this.getPrediccion(this.region).subscribe((resp) => {
        let ss = JSON.stringify(resp, null, 4);
        console.log("respuesta API= " + ss);
        const dataJ = JSON.parse(ss);
        if (this.flagU == 0) {
          this.flagU++;
          this.jsonConcat = dataJ;
        } else {
          this.jsonConcat = this.jsonConcat.concat(dataJ);
        }
        this.loading.dismiss();
        this.jsonMapa();




      });
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

  async predecirCategoriaAllegion() {
    const xL = await this.cargando("Espere, la Red Neural esta categorizando las regiones");
    this.getPrediccion(4).subscribe((resp) => {
      let ss = JSON.stringify(resp, null, 4);
      console.log("respuesta API= " + ss);
      const dataJ = JSON.parse(ss);
      dataJ.forEach(element => {
        console.log(element)

        if (this.logicaFiltro(element)) {
          let icono = element.PREDICCION + "_" + element.PesoContagio;
          this.pintarPunt(icono, element.Latitud, element.Longitud, element.RUP);
        }

      });

    });
    this.getPrediccion(5).subscribe((resp) => {
      let ss = JSON.stringify(resp, null, 4);
      console.log("respuesta API= " + ss);
      const dataJ = JSON.parse(ss);
      dataJ.forEach(element => {
        console.log(element)
        if (this.logicaFiltro(element)) {
          let icono = element.PREDICCION + "_" + element.PesoContagio;
          this.pintarPunt(icono, element.Latitud, element.Longitud, element.RUP);
        }
      });

    });

    this.getPrediccion(6).subscribe((resp) => {
      let ss = JSON.stringify(resp, null, 4);
      //console.log("respuesta API= " + ss);
      const dataJ = JSON.parse(ss);
      dataJ.forEach(element => {
        if (this.logicaFiltro(element)) {
          let icono = element.PREDICCION + "_" + element.PesoContagio;
          this.pintarPunt(icono, element.Latitud, element.Longitud, element.RUP);
        }
      });

    });

    this.getPrediccion(7).subscribe((resp) => {
      let ss = JSON.stringify(resp, null, 4);
      //  console.log("respuesta API= " + ss);
      const dataJ = JSON.parse(ss);
      dataJ.forEach(element => {
        if (this.logicaFiltro(element)) {
          let icono = element.PREDICCION + "_" + element.PesoContagio;
          this.pintarPunt(icono, element.Latitud, element.Longitud, element.RUP);
        }
      });

    });
    this.getPrediccion(8).subscribe((resp) => {
      let ss = JSON.stringify(resp, null, 4);
      // console.log("respuesta API= " + ss);
      const dataJ = JSON.parse(ss);
      dataJ.forEach(element => {
        if (this.logicaFiltro(element)) {
          let icono = element.PREDICCION + "_" + element.PesoContagio;
          this.pintarPunt(icono, element.Latitud, element.Longitud, element.RUP);
        }
      });

    });
    this.getPrediccion(9).subscribe((resp) => {
      let ss = JSON.stringify(resp, null, 4);
      //   console.log("respuesta API= " + ss);
      const dataJ = JSON.parse(ss);
      dataJ.forEach(element => {
        if (this.logicaFiltro(element)) {
          let icono = element.PREDICCION + "_" + element.PesoContagio;
          this.pintarPunt(icono, element.Latitud, element.Longitud, element.RUP);
        }
      });

    });
    this.getPrediccion(10).subscribe((resp) => {
      let ss = JSON.stringify(resp, null, 4);
      //  console.log("respuesta API= " + ss);
      const dataJ = JSON.parse(ss);
      dataJ.forEach(element => {
        if (this.logicaFiltro(element)) {
          let icono = element.PREDICCION + "_" + element.PesoContagio;
          this.pintarPunt(icono, element.Latitud, element.Longitud, element.RUP);
        }
      });

    });
    this.getPrediccion(11).subscribe((resp) => {
      let ss = JSON.stringify(resp, null, 4);
      // console.log("respuesta API= " + ss);
      const dataJ = JSON.parse(ss);
      dataJ.forEach(element => {
        if (this.logicaFiltro(element)) {
          let icono = element.PREDICCION + "_" + element.PesoContagio;
          this.pintarPunt(icono, element.Latitud, element.Longitud, element.RUP);
        }
      });

    });
    this.getPrediccion(12).subscribe((resp) => {
      let ss = JSON.stringify(resp, null, 4);
      console.log("respuesta API= " + ss);
      const dataJ = JSON.parse(ss);
      dataJ.forEach(element => {
        console.log(element)
        if (this.logicaFiltro(element)) {
          let icono = element.PREDICCION + "_" + element.PesoContagio;
          this.pintarPunt(icono, element.Latitud, element.Longitud, element.RUP);
        }
      });

    });
    this.getPrediccion(13).subscribe((resp) => {
      let ss = JSON.stringify(resp, null, 4);
      console.log("respuesta API= " + ss);
      const dataJ = JSON.parse(ss);
      dataJ.forEach(element => {
        console.log(element)
        if (this.logicaFiltro(element)) {
          let icono = element.PREDICCION + "_" + element.PesoContagio;
          this.pintarPunt(icono, element.Latitud, element.Longitud, element.RUP);
        }
      });

    });
    this.getPrediccion(16).subscribe((resp) => {
      let ss = JSON.stringify(resp, null, 4);
      console.log("respuesta API= " + ss);
      const dataJ = JSON.parse(ss);
      dataJ.forEach(element => {
        console.log(element)
        if (this.logicaFiltro(element)) {
          let icono = element.PREDICCION + "_" + element.PesoContagio;
          this.pintarPunt(icono, element.Latitud, element.Longitud, element.RUP);
        }
      });

    });
    this.getPrediccion(14).subscribe((resp) => {
      let ss = JSON.stringify(resp, null, 4);
      //   console.log("respuesta API= " + ss);
      const dataJ = JSON.parse(ss);
      dataJ.forEach(element => {
        if (this.logicaFiltro(element)) {
          let icono = element.PREDICCION + "_" + element.PesoContagio;
          this.pintarPunt(icono, element.Latitud, element.Longitud, element.RUP);
        }
      });
      this.loading.dismiss();

    });

  }



  ionViewWillLeave() {
    //this.map.remove();
  }


  getPrediccion(region) {
    const headers = new HttpHeaders().set("Authorization", "").set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.get(
      'http://127.0.0.1:5000/api/annRiesgoMovTbbSContr/' + region + '',

      { headers: headers }
    );
  }

}
