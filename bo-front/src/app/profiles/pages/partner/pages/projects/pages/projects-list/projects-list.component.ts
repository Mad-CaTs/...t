import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CardProjectComponent } from '../../commons/components/card-project/card-project.component';
import { CodeReferenceComponent } from '../../../../commons/components/code-reference/code-reference.component';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
  standalone: true,
  imports: [CardProjectComponent, CodeReferenceComponent],
})
export default class ProjectsListComponent {
  constructor(private router: Router) {}

  onDetail = () => {
    this.router.navigate(['/profile/partner/projects/details/5']);
  };
}
