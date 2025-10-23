import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapType } from '../../../enums/map-type';
import { MapComponent } from '../../maps/map.component';
import { LocationSearchBarComponent } from '@shared/components/location-search-bar/location-search-bar.component';
import { MapBoxService } from '@shared/services/map-box.service';

@Component({
  standalone: true,
  selector: 'app-modal-map-picker',
  templateUrl: './modal-map-picker.component.html',
  styleUrls: ['./modal-map-picker.component.scss'],
  imports: [CommonModule, MapComponent, LocationSearchBarComponent] 
})
export class ModalMapPickerComponent {
  @Input() initialCoordinates: [number, number] | null = null;
  @Input() coordinates: [number, number] = [-77.0428, -12.0464];
  @ViewChild(MapComponent, { static: false }) private mapComponent!: MapComponent;

  mapType = MapType.ADDRESS;

  selectedCoords: [number, number] | null = null;
  selectedAddress = '';
  saving = false;

  constructor(public activeModal: NgbActiveModal, private geo: MapBoxService) {}

  onSelect(coordinates: [number, number]) {
    this.updateSelection(coordinates);
  }

  onCancel() {
    this.activeModal.dismiss();
  }

  onCenterDefault(): void {
    const coords: [number, number] = this.initialCoordinates ?? this.coordinates;
    this.mapComponent.centerMap(coords);
  }

  onGoTo(coords: [number, number]) {
    this.mapComponent.centerMap(coords);
    this.updateSelection(coords);
  }

  async updateSelection(coords: [number, number]) {
    this.selectedCoords = coords;
    try {
      this.selectedAddress = await this.geo.reverse(coords);
    } catch {
      this.selectedAddress = '';
    }
  }

  async onConfirm() {
    if (!this.selectedCoords) return;
    this.saving = true;
    this.activeModal.close(this.selectedCoords);
  }
}
