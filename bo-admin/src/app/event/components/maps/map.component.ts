import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output,ViewChild } from '@angular/core';
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
import { Feature } from 'ol';
import { MapType } from '../../enums/map-type';

@Component({
  selector: 'app-map-component',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  @ViewChild('map') mapElement!: ElementRef<HTMLDivElement>;

  @Input() mapType: MapType = MapType.ADDRESS;
  @Input() coordinates: number[] = [-77.0428, -12.0464];
  @Output() addressEvent = new EventEmitter<[number, number]>();

  private map!: Map;
  private markerLayer!: VectorLayer<any>;

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    const coords: [number, number] =
      this.coordinates.length === 2
        ? [this.coordinates[0], this.coordinates[1]]
        : [-77.0428, -12.0464];

    this.renderMap(coords);

    if (this.mapType === MapType.ADDRESS) {
      this.handleUserEvents();
      this.renderMarker(coords);
    } else if (this.mapType === MapType.VIEW) {
      this.renderMarker(coords);
    }
  }

  handleUserEvents(): void {
    this.map.on('click', (event) => {
      const coordinate = toLonLat(event.coordinate);
      const coords: [number, number] = [coordinate[0], coordinate[1]];
      this.renderMarker(coords);
      this.addressEvent.emit(coords);
    });
  }

  renderMap(coordinates: [number, number]): void {
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

  renderMarker(coordinates: [number, number]): void {
    this.markerLayer.getSource().clear();

    const marker = new Feature({
      geometry: new Point(fromLonLat(coordinates)),
    });

    const markerStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'assets/media/maps/marker.png',
      }),
    });

    marker.setStyle(markerStyle);
    this.markerLayer.getSource().addFeature(marker);
  }

  public centerMap(coordinates: [number, number]): void {
    if (this.map) {
      const view = this.map.getView();
      view.animate({ center: fromLonLat(coordinates), duration: 300 });
      this.renderMarker(coordinates);
    }
  }
}
