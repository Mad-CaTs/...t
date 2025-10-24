import { Component, OnInit } from '@angular/core';
import EventListComponent from '../../commons/components/event-list/event-list.component';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { ConcatenateSrcDirective } from '@shared/directives/concatenate-src/concatenate-src.directive';
import { CardProyectComponent } from 'src/app/profiles/commons/components/card-proyect/card-proyect.component';
import CardCommunicatedComponent from '../../commons/components/card-communicated/card-communicated.component';


@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [EventListComponent,CardCommunicatedComponent,CommonModule,ConcatenateSrcDirective,CardProyectComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export default class OverviewComponent {

  constructor(private location: Location) {}

 
  eventList = [
    {
      title: 'Proyecto tecnológico',
      date: '22 OCT, 2024',
      location: 'Evento / Virtual',
      imageUrl: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/ef81cddc-6ef7-47ba-a21b-2c48e3a5bf86-proyecto&tecnologico.png'
    },
    {
      title: 'Club de lectura - Hábitos Atómicos',
      date: '22 OCT, 2024',
      location: 'Evento / Virtual',
      imageUrl: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/ef81cddc-6ef7-47ba-a21b-2c48e3a5bf86-J23&INRESORTS&3&PM.png'
    },
    {
      title: 'Proyecto inmobiliario',
      date: '13 OCT, 2024',
      location: 'Evento / Virtual',
      imageUrl: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/ef81cddc-6ef7-47ba-a21b-2c48e3a5bf86-proyecto&tecnologico.png'
    }
  ];

 

  goBack() {
    this.location.back();
  }
  

}
