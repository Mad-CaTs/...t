import { ITabs } from 'src/app/profiles/commons/interface';

export function getPanelTabs(setTab: (id: number) => void): ITabs[] {
	return [
		{
			label: 'Documentos',
			isActive: true,
			tabAction: () => setTab(1)
		},
		{
			label: 'Estados de Legalización',
			isActive: false,
			tabAction: () => setTab(2)
		}
	];
}
