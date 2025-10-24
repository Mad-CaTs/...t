import { IDashboardInfoCard } from '../../../commons/interfaces';
import { ITransferUserData } from '../interfaces';

export function mapSponsorToCardData(data: ITransferUserData): IDashboardInfoCard {
	return {
		color: 'danger',
		type: 'Datos informativos',
		title: `${data.sponsor_name} ${data.sponsor_last_name}`,
		subtitle: 'Patrocinador',
		/*     subtitle: `ID: ${data.sponsor_id}`,
		 */ user: data.sponsor_username
	};
}
