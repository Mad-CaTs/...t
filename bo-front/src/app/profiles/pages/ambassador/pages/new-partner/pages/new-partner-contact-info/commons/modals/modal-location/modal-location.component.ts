import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ISelect } from '@shared/interfaces/forms-control';
import { MapBoxService } from '@shared/services/map-box/map-box.service';
import type { Subscription } from 'rxjs';
import { AutocompleteComponent } from '@shared/components/form-control/autocomplete/autocomplete.component';
import { MapType } from '@shared/enums/map-type';
import { MapContainer } from '@shared/components/map/map.container';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'app-modal-location',
  templateUrl: './modal-location.component.html',
  standalone: true,
  imports: [MapContainer, AutocompleteComponent, ModalComponent],
  styleUrls: [],
})
export class ModalLocationComponent {
  @Input() form: FormGroup;

  public address = new FormControl('');
  public loading = false;
  public searchOpt: ISelect[] = [];
  public mapType: typeof MapType = MapType;

  private subscribers: Subscription[] = [];

  constructor(
    public instanceModal: NgbActiveModal,
    private mapService: MapBoxService

    
  ) {}

  ngOnInit(): void {
   

    
    const addressForm = this.form.get('address');

    if (addressForm) this.address.setValue(addressForm.value);

    const subs = this.address.valueChanges.subscribe((v) =>
      this.watchAddress(v)
    );

    this.subscribers.push(subs);
  }

  ngOnDestroy(): void {
    this.subscribers.forEach((s) => s.unsubscribe());
  }

  async watchAddress(v: string) {
    const format = v.toLocaleLowerCase();
    this.loading = true;

    const locations = await this.mapService.getCoordinates(format);

    this.loading = false;

    if (!locations) return;

    this.searchOpt = locations.map((l, i) => ({
      value: i,
      content: l.place_name,
    }));
    this.form.get('address').setValue(v);
    this.form.updateValueAndValidity();
  }
}
