import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { ModalInfoComponent } from "@shared/components/modal/modal-info/modal-info.component";
import { PagesCard } from '../../commons/constants/pages-card';
import { Pages } from '../../commons/enums/guest.enum';
import { PanelsComponent } from "../../commons/components/panels/panels.component";
import { ModalNotifyComponent } from '@shared/components/modal/modal-notify/modal-notify.component';

@Component({
  selector: 'app-my-market',
  standalone: true,
  imports: [ModalNotifyComponent, CommonModule, PanelsComponent],
  templateUrl: './my-market.component.html',
  styleUrl: './my-market.component.scss'
})
export class MyMarketComponent implements OnInit {
  showModal = false;
  modalTitle = '';
  modalMessage = '';

  myMarket = PagesCard[Pages.MY_MARKET];

  constructor(private router: Router) {}

  ngOnInit(): void {
    //inicialize
  }

  onCloseModal() {
    this.showModal = false;
    this.modalTitle = '';
    this.modalMessage = '';
  }

  openModal() {
    console.log("modal abierto")
    this.showModal = true;
    this.modalTitle = 'Vista en proceso';
    this.modalMessage = 'Esta sección está en desarrollo y estará disponible pronto.';
  }

}