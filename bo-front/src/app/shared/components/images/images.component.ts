// imagenes.component.ts
import { DropdownModule } from 'primeng/dropdown';
import { Component, OnInit } from '@angular/core';
import { ImagesService } from './images.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-images',
  standalone:true,
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule
   
  ],
})
export default  class ImagenesComponent implements OnInit {

  cities: City[] | undefined;

  selectedCity: City | undefined;

 

  imagenes: string[] = [];

  constructor(private imagesService: ImagesService) { }

  ngOnInit(): void {
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
  ];
    this.imagesService.getImagenes().subscribe(imagenes => {
      this.imagenes = imagenes;
    });
  }

}
