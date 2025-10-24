import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { CardProyectComponent } from 'src/app/profiles/commons/components/card-proyect/card-proyect.component';
import TabProfilesComponent from 'src/app/profiles/commons/components/tab-profiles/tab-profiles.component';
import { PetResourceServerService } from '../../services/pet-resource-server.service';

@Component({
  selector: 'app-my-briefcase',
  templateUrl: './my-briefcase.component.html',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatProgressBarModule, CardProyectComponent, TabProfilesComponent],
  styleUrls: [],
})
export class MyBriefcaseComponent {
  @Input() withoutBox: boolean = false;
  @Input() withoutTitle: boolean = false;
  @Input() noIndicators: boolean = false;

  constructor(
    private registry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private readonly petResourceServerService: PetResourceServerService
  ) {
   
  }

  getTest() {
    console.log('test');
    this.petResourceServerService.testApi().subscribe({
      next: (response) => console.log(response),
      error: (error) => console.error(error)
    });
  }
}
