import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SubProfileChangeItemComponent } from './commons/components/sub-profile-change-item/sub-profile-change-item.component';
import { SubProfile } from 'src/app/profiles/commons/enums';
import { ProfileRouteData } from '../../interface';
import { AuthenticationService } from '@shared/services';
import { UserResponse } from 'src/app/authentication/commons/interfaces/authenticate.interface';
import { DividerModule } from 'primeng/divider';
import { PrincipalProfileComponent } from './commons/components/principal-profile/principal-profile.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
	selector: 'app-modal-change-profile',
	templateUrl: './modal-change-profile.component.html',
	standalone: true,
	imports: [
		CommonModule,
		MatIconModule,
		SubProfileChangeItemComponent,
		DividerModule,
		PrincipalProfileComponent
	],
	styleUrls: ['./modal-change-profile.component.scss']
})
export class ModalChangeProfileComponent {
	public profiles: ProfileRouteData[] = JSON.parse(localStorage.getItem('user_all_info')).map(
		(user: UserResponse, index: number) => {
			const currentUser = JSON.parse(localStorage.getItem('user_info'));
			const isParent = index === 0;

			return {
				user: {
					...user,
					name: user.name.split(' ')[0],
					lastName: user.lastName.split(' ')[0]
				},
				subProfile:
					user.username === currentUser?.username
						? SubProfile.GLOBAL
						: isParent
						? SubProfile.PRIMARY
						: SubProfile.SECONDARY,
				abbreviation: isParent
					? (user.name.charAt(0) + user.lastName.charAt(0)).toUpperCase()
					: user.name.charAt(0) + index,
				isSelected: user.username === currentUser?.username,
				title:
					user.username === currentUser?.username
						? 'Perfil Global'
						: isParent
						? 'Perfil Principal'
						: 'Perfil Secundario'
			};
		}
	);

	private _authenticationService: AuthenticationService = inject(AuthenticationService);
	private ref: DynamicDialogRef = inject(DynamicDialogRef);

	onSelectSubProfile(username: string) {
		const selectedProfile = this.profiles.find((profile) => profile.user.username === username);
		selectedProfile.isSelected = true;
		this._authenticationService.setUserDataByUsername(username);
		this.closeModal();
		window.location.reload();
	}

	closeModal() {
		this.ref.close();
	}
}
