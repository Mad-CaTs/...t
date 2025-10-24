import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-packages',
    templateUrl: 'packages.component.html',
    styleUrls: ['./packages.component.css'],
    standalone: true,
    imports: [ MatButtonModule, MatIconModule ]
})


export class PackagesComponent {

}