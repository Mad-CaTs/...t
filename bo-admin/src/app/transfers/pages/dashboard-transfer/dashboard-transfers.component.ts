import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-dashboard-transfers',
	templateUrl: './dashboard-transfers.component.html',
	standalone: true,
	imports: [CommonModule, RouterOutlet],
	styleUrls: ['./dashboard-transfers.component.scss']
})
export  class DashboardTransfersComponent {}
