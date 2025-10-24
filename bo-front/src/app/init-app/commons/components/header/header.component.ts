import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { DrawerComponent } from './commons/components/drawer';
import { NavBarComponent } from './commons/components/navbar';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [DrawerComponent, NavBarComponent],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss'
})
export class HeaderComponent {
	public showFooter: boolean = true;
	public title = 'backoffice';
	public showDrawer: boolean = false;
	@Input() showOnlyLogoAndBackButton: boolean = false;
	@Output() backClick = new EventEmitter<void>(); 


	constructor(private modalConfig: NgbModalConfig, private cdRef: ChangeDetectorRef) {
		modalConfig.backdrop = 'static';
	}

	ngOnInit(): void {}

	emitGoHome() {
		this.backClick.emit(); 
	  }
}
