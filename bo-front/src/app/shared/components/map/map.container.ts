import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapType } from '@shared/enums/map-type';
import { MapBoxService } from '@shared/services/map-box/map-box.service';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { MapComponent } from './map.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.container.html',
  standalone: true,
  imports: [CommonModule, MapComponent],
  styleUrls: ['./map.component.scss'],
})
export class MapContainer implements OnInit {
  /**
   * Tipo de mapa a mostrar
   */
  @Input() mapType: MapType;

  /**
   * Direccion en letras
   */
  @Input() address: string;

  /**
   * Arreglo de coordenadas longitud y latitud
   */
  @Input() coordinates: Array<number>;

  /**
   * Evento que envia las coordenas del lugar seleccionado al container
   */
  @Output() addressEvent = new EventEmitter<string>();

  /**
   * Evento que envia el estado cargando hacia el componente padre
   */
  @Output() loading = new EventEmitter<boolean>();

  /**
   * Creates an instance of map container.
   * @param mapBoxService Servicio para obtener las direcciones en coordenadas o letras
   */
  constructor(private mapBoxService: MapBoxService) {}

  ngOnInit(): void {
    this.handleAddressMap();
  }

  /**
   * @description Se encarga de ontener las coordenadas de una direccion dada
   * @returns Promise
   */
  async handleAddressMap(): Promise<void> {
    if (this.mapType === MapType.ADDRESS) {
      this.loading.emit(true);
      this.coordinates = await this.mapBoxService.getLocByAddress(this.address);
      this.loading.emit(false);
    }
  }

  /**
   * @description Se encarga de ontener la direccion de unas coordenada dada
   * @returns Promise
   */
  async onClickMap(coordinate: Array<number>): Promise<void> {
    this.loading.emit(true);
    const address = await this.mapBoxService.getAddressByLoc(coordinate);
    this.addressEvent.emit(address);
    this.loading.emit(false);
  }
}
