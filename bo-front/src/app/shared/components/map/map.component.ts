import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MapType } from '@shared/enums/map-type';
import { Feature } from 'ol';

import Map from 'ol/Map';
import View from 'ol/View';
import { Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat, toLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';

@Component({
  selector: 'app-map-component',
  templateUrl: './map.component.html',
  standalone: true,
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  /**
   * Intancia de div donde se renderizará el mapa
   */
  @ViewChild('map') mapElement: ElementRef;

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
  @Output() addressEvent = new EventEmitter<Array<number>>();

  private map: Map;
  private markerLayer: VectorLayer<any>;

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
  }

  /**
   * @description Inicializa el mapa segun los tipos ADDRESS o VIEW
   */
  initMap(): void {
    const defaultCoordinates = [-77.0428, -12.0464];
    const initialCoordinates = this.coordinates && this.coordinates.length === 2 ? this.coordinates : defaultCoordinates;
    this.renderMap(initialCoordinates);

    if (this.mapType === MapType.ADDRESS) {
      this.handleUserEvents();
      if (this.address) {
        this.renderMarker(initialCoordinates);
      }
    } else if (this.mapType === MapType.VIEW) {
      this.renderMarker(initialCoordinates);
    }
  }

  /**
   * @description Maneja los eventos de usuario en el mapa como el Click
   */
  handleUserEvents(): void {
    this.map.on('click', async (event) => {
      const coordinate = toLonLat(event.coordinate);
      this.renderMarker(coordinate);
      this.addressEvent.emit(coordinate);
    });
  }

  /**
   * @description Muestra el mapa en el div
   */
  renderMap(coordinates: Array<number>): void {
    this.map = new Map({
      target: this.mapElement.nativeElement,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat(coordinates),
        zoom: 18,
      }),
    });

    this.markerLayer = new VectorLayer({
      source: new VectorSource(),
    });
    this.map.addLayer(this.markerLayer);
  }

  /**
   * @description Muestra la marca del lugar seleccionado
   * @param coordinates Arreglo de numeros longitud y latitud
   */
  renderMarker(coordinates: Array<number>): void {
    this.markerLayer.getSource().clear();

    const marker = new Feature({
      geometry: new Point(fromLonLat(coordinates)),
    });

    const markerStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'assets/marker.png', // Ruta de la imagen del marcador
      }),
    });

    marker.setStyle(markerStyle);

    this.markerLayer.getSource().addFeature(marker);
  }
}
