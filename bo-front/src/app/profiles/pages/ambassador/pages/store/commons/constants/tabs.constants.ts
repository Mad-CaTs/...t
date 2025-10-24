import { INavigation } from '@init-app/interfaces';

export const TABS: INavigation[] = [
  { id: 1, text: 'Paquetes',icon: 'assets/icons/paquetes.svg' },
  /* ocultado hasta implementar Integración*/
/*   { id: 2, text: 'Servicios' ,icon: 'assets/icons/paquetes.svg'},
  { id: 3, text: 'Productos' ,icon: 'assets/icons/product.svg'}, */
  { id: 4, text: 'Registro de Invitados',icon: 'assets/icons/gentle.svg' }

];

export const PROSPECT_TABS: INavigation[] = [
  { id: 1, text: 'Nuevo prospecto', icon: 'pi pi-user-plus' },
  { id: 2, text: 'Lista de prospectos', icon: 'pi pi-list' }
];


export const TEMPORAL_PROSPECT_TAB: INavigation[] = [
  { id: 1, text: 'Nuevo prospecto', icon: 'pi pi-user-plus' }
];

export const MIGRATION_TABS: INavigation[] = [
  { id: 1, text: 'Paquetes', icon: 'pi pi-box' },
  { id: 2, text: 'Portafolios', icon: 'pi pi-box' }
];


