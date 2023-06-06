import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CheckboxCustomEvent, LoadingController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {

  fecha
  fechaDesde
  diasAtras
  leche
  predioLeche: number = 1
  carne
  predioCarne: number = 1
  mata
  mataderoCarne: number = 1
  centro
  controlAnimalVivo: number = 1
  rodeo
  centroRodeo: number = 1
  crianza
  predioCrianza: number = 1
  compra
  predioCompra: number = 1
  feria
  feriaCompra: number = 1
  flujoAlto: number = 1
  flujoMedioAlto: number = 1
  flujoMedio: number = 1
  flujoBajo: number = 1
  vigilanciaAlta: number = 1
  vigilanciaMedia: number = 1
  vigilanciaBaja: number = 1


  constructor() { }

  ngOnInit() {
  //  
  }

  async ionViewDidEnter(){
    this.getConfiguracion()
  }

  
  async handlefecha(e) {

    var d = e.target.value
    var dA = d.split('T');
    var dAT = dA[0].split('-');

    this.fecha = dAT[2] + "-" + dAT[1] + "-" + dAT[0];
    this.fechaDesde = this.fecha
   // alert(this.fecha)
  }

  async handlepredioLeche(e) {
    //alert(e.target.value)
    this.predioLeche = e.target.value;
    this.leche = e.target.value;
  }
  async handlepredioCarne(e) {
    //alert(e.target.value)
    this.predioCarne = e.target.value;
  }
  async handlemataderoCarne(e) {
    //alert(e.target.value)
    this.mataderoCarne = e.target.value;
  }
  async handlecontrolAnimalVivo(e) {
    //alert(e.target.value)
    this.controlAnimalVivo = e.target.value;
  }
  async handlecentroRodeo(e) {
    //alert(e.target.value)
    this.centroRodeo = e.target.value;
  }
  async handlepredioCrianza(e) {
    //alert(e.target.value)
    this.predioCrianza = e.target.value;
  }
  async handlepredioCompra(e) {
    //alert(e.target.value)
    this.predioCompra = e.target.value;
  }
  async handleferiaCompra(e) {
    //alert(e.target.value)
    this.feriaCompra = e.target.value;
  }

  async getConfiguracion() {
    const { value } = await Preferences.get({ key: 'configuracion' });
    var dataOf = JSON.parse(value);
    var data = dataOf || undefined;

    if (data == undefined){
      
    }else{
      //alert()
      this.fechaDesde = data.fecha
      this.diasAtras = data.diasAtras
      this.leche = data.predioLeche
      this.carne = data.predioCarne
      this.mata = data.mataderoCarne
      this.centro = data.controlAnimalVivo
      this.rodeo = data.centroRodeo
      this.crianza = data.predioCrianza
      this.compra = data.predioCompra
      this.feria = data.feriaCompra
      this.flujoAlto = data.flujoAlto
      this.flujoMedioAlto = data.flujoMedioAlto
      this.flujoMedio = data.flujoMedio
      this.flujoBajo = data.flujoBajo
      this.vigilanciaAlta = data.vigilanciaAlta
      this.vigilanciaMedia = data.vigilanciaMedia
      this.vigilanciaBaja = data.vigilanciaBaja 
    }
   

  }

  async guardar() {

    var ojb = {
      fecha : this.fecha,
      diasAtras:this.diasAtras,
      predioLeche: this.predioLeche,
      predioCarne: this.predioCarne,
      mataderoCarne: this.mataderoCarne,
      controlAnimalVivo: this.controlAnimalVivo,
      centroRodeo: this.centroRodeo,
      predioCrianza: this.predioCrianza,
      predioCompra: this.predioCompra,
      feriaCompra: this.feriaCompra,
      flujoAlto: this.flujoAlto,
      flujoMedioAlto: this.flujoMedioAlto,
      flujoMedio: this.flujoMedio,
      flujoBajo: this.flujoBajo,
      vigilanciaAlta: this.vigilanciaAlta,
      vigilanciaMedia: this.vigilanciaMedia,
      vigilanciaBaja: this.vigilanciaBaja
    }

    let ss = JSON.stringify(ojb);

    Preferences.set({
      key: 'configuracion',
      value: ss
    });

  }
}
