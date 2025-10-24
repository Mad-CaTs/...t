import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ModalChangeProfileComponent } from '../../modals/modal-change-profile/modal-change-profile.component';
import TabProfilesComponent from 'src/app/profiles/commons/components/tab-profiles/tab-profiles.component';
import { ITabs } from 'src/app/profiles/commons/interface';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
	selector: 'app-profile-dashboard-header',
	standalone: true,
	templateUrl: './profile-dashboard-header.component.html',
	styleUrl: './profile-dashboard-header.component.scss',
	imports: [MatIconModule, FormsModule, TabProfilesComponent],
	providers: [DialogService]
})
export class ProfileDashboardHeaderComponent {
	@Input() profileTitle: string;
	@Input() tabs: Array<ITabs>;

	public inputValue: any;

	constructor(private dialogService: DialogService) { }

	onChangeProfile() {
		this.dialogService.open(ModalChangeProfileComponent, {
			width: '450px',
			breakpoints: {
				'460px': '90vw',
				'320px': '95vw'
			}
		});
	}
}
