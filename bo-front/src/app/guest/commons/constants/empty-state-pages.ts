import { Pages } from "../enums/guest.enum";
import { EmptyState } from "../interfaces/guest-components.interface";

export const EmptyStates: Record<Pages, EmptyState> = {
    [Pages.MY_PURCHASES]: {
        icon: 'pi-shopping-cart',
        title: 'No tienes compras para mostrar',
        message: 'Realiza tu primera compra visitando nuestra página.',
        link: {
            url: '/guest/products',
            label: 'Ver eventos'
        },
    },
    [Pages.MY_TICKETS]: {
        icon: 'pi-ticket',
        title: 'No tienes entradas para mostrar',
        message: 'Realiza tu primera compra visitando nuestra página.',
        link: {
            url: '/guest/products',
            label: 'Ir a productos'
        },
    },
    [Pages.MY_DETAILS_TICKETS]: {
        icon: '',
        title: '',
        message: '',
        link: {
            url: '',
            label: ''
        }
    },
    [Pages.MY_PASSWORD]: {
        icon: '',
        title: '',
        message: '',
        link: {
            url: '',
            label: ''
        }
    },
    [Pages.MY_PROFILE]: {
        icon: '',
        title: '',
        message: '',
        link: {
            url: '',
            label: ''
        }
    },
    [Pages.MY_MARKET]: {
        icon: '',
        title: '',
        message: '',
        link: {
            url: '',
            label: ''
        }
    },
};