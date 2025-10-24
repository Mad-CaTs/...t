import { UserResponse } from 'src/app/authentication/commons/interfaces/authenticate.interface';
import { SubProfile } from 'src/app/profiles/commons/enums';

export interface ProfileRouteData {
	user: UserResponse;
	subProfile: SubProfile;
	isSelected: boolean;
	abbreviation: string;
	title: string;
}
