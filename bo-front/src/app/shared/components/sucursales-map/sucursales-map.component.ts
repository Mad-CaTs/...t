import { CommonModule } from '@angular/common';
import {
	Component,
	Input,
	AfterViewInit,
	OnChanges,
	SimpleChanges,
	ViewChild,
	ElementRef,
	EventEmitter,
	Output
} from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import { Extent, boundingExtent } from 'ol/extent';

@Component({
	selector: 'app-sucursales-map',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './sucursales-map.component.html',
	styleUrls: ['./sucursales-map.component.scss']
})
export class SucursalesMapComponent implements AfterViewInit, OnChanges {
	@Input() sucursales: any[] = [];
	@Input() center: [number, number] = [0, 0]; // [lat, lon]
	@Output() markerClick = new EventEmitter<any>();

	@ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

	private map!: Map;
	private vectorLayer!: VectorLayer<any>;
	private vectorSource!: VectorSource;

	ngAfterViewInit(): void {
		this.initMap();
	}
	ngOnChanges(changes: SimpleChanges): void {
		if (!this.map) return;

		if (changes['center']) {
			this.map.getView().setCenter(fromLonLat([this.center[1], this.center[0]]));
			this.map.getView().setZoom(14);
		}

		if (changes['sucursales']) {
			this.updateMarkers();
		}
	}

	/* 	ngOnChanges(changes: SimpleChanges): void {
		if (!this.map) {
			console.log('Mapa aún no inicializado.');
			return;
		}

		if (changes['center'] && this.center && this.center.length === 2) {
			console.log('Cambiando centro a:', this.center);
			this.map.getView().setCenter(fromLonLat([this.center[1], this.center[0]])); // lon, lat
			this.map.getView().setZoom(14);
		}

		if (changes['sucursales']) {
			console.log('Actualizando marcadores de sucursales. Cantidad:', this.sucursales.length);
			this.updateMarkers();
		}
	} */

	private initMap(): void {
		this.initVectorLayer();
		this.createMapInstance();
		this.setupMarkerClickHandler();
		this.updateMarkers();
	}

	private initVectorLayer(): void {
		this.vectorSource = new VectorSource();
		this.vectorLayer = new VectorLayer({
			source: this.vectorSource
		});
	}

	private createMapInstance(): void {
		this.map = new Map({
			target: this.mapContainer.nativeElement,
			layers: [this.createBaseLayer(), this.vectorLayer],
			view: this.createView()
		});
	}

	private createBaseLayer() {
		return new TileLayer({
			source: new OSM()
		});
	}

	private createView() {
		return new View({
			center: fromLonLat([this.center[1], this.center[0]]),
			zoom: 14
		});
	}

	/* 	private initMap(): void {
		this.vectorSource = new VectorSource();
		this.vectorLayer = new VectorLayer({
			source: this.vectorSource
		});

		this.map = new Map({
			target: this.mapContainer.nativeElement,
			layers: [
				new TileLayer({
					source: new OSM()
				}),
				this.vectorLayer
			],
			view: new View({
				center: fromLonLat([this.center[1], this.center[0]]),
				zoom: 14
			})
		});
		this.setupMarkerClickHandler();
this.updateMarkers();
	} */

	private setupMarkerClickHandler(): void {
		this.map.on('singleclick', (evt) => {
			this.map.forEachFeatureAtPixel(evt.pixel, (feature) => {
				const id = feature.getId();
				if (id !== undefined && this.sucursales[id]) {
					this.markerClick.emit(this.sucursales[id]);
				}
			});
		});
	}

	private updateMarkers(): void {
		this.vectorSource.clear();

		if (!this.sucursales || this.sucursales.length === 0) {
			console.log('No hay sucursales para mostrar.');
			return;
		}

		const coordsForExtent: any[] = [];

		this.sucursales.forEach((suc, idx) => {
			if (this.isValidSucursal(suc)) {
				const feature = this.createMarkerFeature(suc, idx);
				this.vectorSource.addFeature(feature);
				coordsForExtent.push(fromLonLat([suc.lon, suc.lat]));
			} else {
				console.warn(`Sucursal #${idx + 1} no tiene lat y lon válidos:`, suc);
			}
		});

		console.log('Marcadores actualizados. Total:', this.vectorSource.getFeatures().length);

		this.adjustMapViewToMarkers(coordsForExtent);
	}

	private isValidSucursal(suc: any): boolean {
		return suc.lat && suc.lon;
	}

	private createMarkerFeature(suc: any, idx: number): Feature {
		const feature = new Feature({
			geometry: new Point(fromLonLat([suc.lon, suc.lat]))
		});
		feature.setId(idx);

		const markerStyle = new Style({
			image: new Icon({
				anchor: [0.5, 1],
				src: 'assets/marker.png',
				scale: 1,
        
			}),
			text: new Text({
				offsetY: 20,
				font: '14px Calibri,sans-serif',
				fill: new Fill({ color: '#000' }),
				stroke: new Stroke({ color: '#fff', width: 2 })
			})
		});

		feature.setStyle(markerStyle);
		return feature;
	}

	private adjustMapViewToMarkers(coordsForExtent: any[]): void {
		if (coordsForExtent.length > 0) {
			const extent: Extent = boundingExtent(coordsForExtent);
			this.map.getView().fit(extent, {
				padding: [50, 50, 50, 50],
				maxZoom: 16,
				duration: 1000
			});
		}
	}

	/* 	private updateMarkers(): void {
		this.vectorSource.clear();

		if (!this.sucursales || this.sucursales.length === 0) {
			console.log('No hay sucursales para mostrar.');
			return;
		}

		const coordsForExtent = [];

		this.sucursales.forEach((suc, idx) => {
			if (suc.lat && suc.lon) {
				console.log(`Marcador agregado para sucursal #${idx + 1} en:`, suc.lat, suc.lon);
			

				const feature = new Feature({
					geometry: new Point(fromLonLat([suc.lon, suc.lat]))
					
				});

				feature.setId(idx);

				const markerStyle = new Style({
					image: new Icon({
						anchor: [0.5, 1],
						src: 'assets/marker.png', 
						scale: 1
					}),
					text: new Text({
						 offsetY: 20, 
						font: '14px Calibri,sans-serif',
						fill: new Fill({ color: '#000' }),
						stroke: new Stroke({ color: '#fff', width: 2 })
					})
				});

				feature.setStyle(markerStyle);
				this.vectorSource.addFeature(feature);
				coordsForExtent.push(fromLonLat([suc.lon, suc.lat]));
			} else {
				console.warn(`Sucursal #${idx + 1} no tiene lat y lon válidos:`, suc);
			}
		});

		console.log('Marcadores actualizados. Total:', this.vectorSource.getFeatures().length);

		if (coordsForExtent.length > 0) {
			const extent: Extent = boundingExtent(coordsForExtent);
			this.map.getView().fit(extent, {
				padding: [50, 50, 50, 50],
				maxZoom: 16,
				duration: 1000
			});
		}
	} */
}
