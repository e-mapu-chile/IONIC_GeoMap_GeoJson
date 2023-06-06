import { HttpClient } from '@angular/common/http';
import { Component, QueryList, ViewChild, ViewChildren, } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { IonSlide } from '@ionic/core/components';


@Component({
  selector: 'app-dashboard-mortalidad',
  templateUrl: './dashboard-mortalidad.page.html',
  styleUrls: ['./dashboard-mortalidad.page.scss'],
})
export class DashboardMortalidadPage {
  mySlideOptions = {
    speed: 2500
    //loop: true,
    //autoplay: true
  };
  @ViewChild('subscriptionSlider', { read: IonSlides }) slider: IonSlides;
  zonasHeader = [];
  diasSinMuertosZona = [];
  detalleMuertosZona = [];
  zonaDataDisplay: any = [];

  constructor(private http: HttpClient,) { }
  async ionViewDidEnter() {
    await this.obtenerZonasHeader();
    await this.obtenerDiasSinMuertos('')
    this.slider.startAutoplay();
    

  }

 
  flag = 0;
  sliderChanges(r) {

    const context = this;
    var cantZo = this.zonasHeader.length;
    console.log(cantZo);
    

    if (this.flag > cantZo){//this.flag) {
      this.flag = 0;
    //  window.location.reload();
      // this.slider.slideTo(0);
      // this.slider.startAutoplay();
    } else {
      this.flag++;
    }
   
    console.log(this.flag);

  }

  async setDataReporte() {
    for await (const x of this.zonasHeader) {

      var dataNoMuerto = this.diasSinMuertosZona.filter((f) => f.nombre == x.nombre)
      var dataDetalle = this.detalleMuertosZona.filter((f) => f.nombre == x.nombre)

      var dataNM = dataNoMuerto || [];
      var dataD = dataDetalle || [];

      var data = {
        zona: x.nombre,
        noMuertos: dataNM,
        detalle: dataD
      }

      this.zonaDataDisplay.push(data);



    }
  }


  obtenerZonasHeader() {
    this.getZonasHeader().subscribe((resp) => {
      let ss = JSON.stringify(resp, null, 4);
      //  console.log("respuesta API DATASET= " + ss);
      const dataJ = JSON.parse(ss);
      var myLines = [];
      this.zonasHeader = dataJ.zonas;


    });
  }

  async obtenerDiasSinMuertos(zona) {
    this.getZonasSinMuertos(zona).subscribe(async (resp) => {
      let ss = JSON.stringify(resp, null, 4);
      //  console.log("respuesta API DATASET= " + ss);
      const dataJ = JSON.parse(ss);

      this.diasSinMuertosZona = dataJ.noMuerto;
      this.detalleMuertosZona = dataJ.zonas;
      await this.setDataReporte();
      console.log(this.zonaDataDisplay)



    });
  }


  getZonasHeader() {
    return this.http.get(
      'https://pssoft.cl/influenzaAviarrest/getZonasReporte'//,
      //{ headers: headers }
    );
  }

  getZonasSinMuertos(zona) {
    return this.http.get(
      'https://pssoft.cl/influenzaAviarrest/getDiasSinMuertosZona?zona='//,
      //{ headers: headers }
    );
  }




}
