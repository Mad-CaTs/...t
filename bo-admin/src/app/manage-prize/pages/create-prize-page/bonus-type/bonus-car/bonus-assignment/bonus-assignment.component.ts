import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { INavigationTab } from '@interfaces/shared.interface';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';

@Component({
    selector: 'app-bonus-assignment',
    standalone: true,
    imports: [CommonModule, NavigationComponent, RouterOutlet],
    templateUrl: './bonus-assignment.component.html',
    styleUrls: ['./bonus-assignment.component.scss']
})
export class BonusAssignmentComponent {
    public readonly navigationData: INavigationTab[] = [
        { path: '/dashboard/manage-prize/bonus-type/car/bonus-assignment/history', name: 'Bonos históricos' },
        { path: '/dashboard/manage-prize/bonus-type/car/bonus-assignment/active', name: 'Bonos vigentes' }

    ];
}
