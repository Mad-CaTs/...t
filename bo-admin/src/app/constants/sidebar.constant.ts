import { Title } from 'chart.js';
import { link } from 'fs';
import { title } from 'process';

export const MENU_ITEMS = [
	{
		title: 'Usuarios',
		link: '/users',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		subMenu: [
			{ title: 'Administración de usuarios', link: '/dashboard/users/manage' },
			{ title: 'Modificar datos del usuario', link: '/dashboard/users/modify' },
			{ title: 'Lista de socios', link: '/dashboard/users/list' },
			{ title: 'Gestión de patrocinio', link: '/dashboard/users/sponsorship-list' },
			{ title: 'Envío de correos', link: '/dashboard/users/emailing' },
			{ title: 'Nuevos Rangos', link: '/dashboard/users/new-ranges' },
			{ title: 'Históricos de periodos', link: '/dashboard/users/historical-periods' }
		]
	},
	{
		title: 'Afiliación',
		link: '/affiliation',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		subMenu: [{ title: 'Validar documentos', link: '/dashboard/affiliation/validate-docs' }]
	},
	{
		title: 'Gestor de entradas',
		link: '/entry',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		subMenu: [
			{ title: 'Validar pagos', link: '/dashboard/entry/payments-validate' },
			{ title: 'Informe de tickets', link: '/dashboard/entry/ticket-report' }
		]
	},
	{
		title: 'Gestión de eventos',
		link: '/events',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		subMenu: [
			{ title: 'Tipos de eventos', link: '/dashboard/events/event-types' },
			{ title: 'Tipos de entradas', link: '/dashboard/events/entry-types' },
			{ title: 'Tipos de asientos', link: '/dashboard/events/seat-types' },
			{ title: 'Lugares de eventos', link: '/dashboard/events/event-venues' },
			{ title: 'Crear evento', link: '/dashboard/events/create-event' },
			{ title: 'Crear zonas y tarifas', link: '/dashboard/events/zones-pricing' },
			{ title: 'Paquetes y promociones', link: '/dashboard/events/package-event' },
			{ title: 'Histórico de eventos', link: '/dashboard/events/event-history' }
		]
	},
	{
		title: 'Gestión de home',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		link: '/manage-home',
		subMenu: [
			{
				title: 'Banner Principal',
				link: '/dashboard/manage-home/banner'
			},
			{
				title: 'Eventos',
				link: '/dashboard/manage-home/events',
				subMenu: [
					{
						title: 'Pago de eventos',
						link: '/dashboard/manage-home/events/payments'
					},
					{
						title: 'Eventos',
						link: '/dashboard/manage-home/events/list'
					},
					{
						title: 'Tipo de eventos',
						link: '/dashboard/manage-home/events/event-types'
					},
					{
						title: 'Subtipo de eventos',
						link: '/dashboard/manage-home/events/event-subtypes'
					},
					{
						title: 'Links',
						link: '/dashboard/manage-home/events/links'
					},
					{
						title: 'Landing',
						link: '/dashboard/manage-home/events/landing'
					},
					{
						title: 'Viajes',
						link: '/dashboard/manage-home/events/travels'
					},
					{
						title: 'Lista de socios',
						link: '/dashboard/manage-home/events/partners-list'
					}
				]
			},
			{
				title: 'Noticias',
				link: '/dashboard/manage-home/news'
			}
		]
	},
	{
		title: 'Gestor de negocios',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		link: '/manage-business',
		subMenu: [
			/* 			{
							title: 'Administrador wallet',
							link: '/dashboard/manage-business/wallet'
						}, */
			{
				title: 'Paquetes',
				link: '/dashboard/manage-business/packages',
				subMenu: [
					{
						title: 'Familias',
						link: '/dashboard/manage-business/packages/families'
					},
					{
						title: 'Paquetes',
						link: '/dashboard/manage-business/packages/packages'
					},
					{
						title: 'Detalle',
						link: '/dashboard/manage-business/packages/detail'
					},
					{
						title: 'Histórico', //Nuevo Modulo
						link: '/dashboard/manage-business/packages/historical'
					},
					{
						title: 'Código promocional',
						link: '/dashboard/manage-business/packages/codes'
					}
				]
			},
			{
				title: 'Administrador de mora y periodo de gracia',
				link: '/dashboard/manage-business/grace-and-debt'
			},
			{
				title: 'Herramientas',
				link: '/dashboard/manage-business/tools'
			},
			// {
			// 	title: 'Editor de comisiones',
			// 	link: '/dashboard/manage-business/comission'
			// },
			{
				title: 'Periodos',
				link: '/dashboard/manage-business/periods'
			}
			/* 		{
						title: 'Periodo de gracia',
						link: '/dashboard/manage-business/gracia-period'
					} */
		]
	},
	{
		title: 'Administrador wallet',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		link: '/manager-wallet',
		subMenu: [
			{
				title: 'Wallet',
				link: '/dashboard/manager-wallet/wallet'
			},
			{
				title: 'Retiros',
				link: '/dashboard/manager-wallet/retiros',
				subMenu: [
					{
						title: 'BCP',
						link: '/dashboard/manager-wallet/retiros/bcp'
					},

					// por el momento Interbank estara desactivado
					// {
					// 	title:'Interbank',
					// 	link:'/dashboard/manager-wallet/retiros/interbank'
					// }

				]
			},
			{
				title: 'Auditoría de Modificaciones',
				link: '/dashboard/manager-wallet/auditoria-de-modificaciones'
			}
		]
	},
	{
		title: 'Beneficiarios',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		link: '/beneficiaries',
		subMenu: [
			{
				title: 'Administrador de beneficios',
				link: '/dashboard/beneficiaries/administrator-beneficiaries'
			},
			{
				title: 'Gestor de beneficiarios',
				link: '/dashboard/beneficiaries/manager-beneficiaries'
			}
			
		]
	},
	{
		title: 'Administrador de Comisiones',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		link: '/commission-manager',
		subMenu: [
			{
				title: 'Tipo de Comisiones',
				link: '/dashboard/commission-manager/commission-type'
			},
			{
				title: 'Bono de Logro de Rango',
				link: '/dashboard/commission-manager/rank-bonus'
			},
			{
				title: 'Histórico de Comisiones',
				link: '/dashboard/commission-manager/historical',
				subMenu: [
					{
						title: 'Comisiones',
						link: '/dashboard/commission-manager/historical/commissions'
					},
					{
						title: 'Padrinos',
						link: '/dashboard/commission-manager/historical/sponsors'
					}
				]
			}
		]
	},
	{
		title: 'Validaciones de pago',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		link: '/payment-validate',
		subMenu: [
			{
				title: 'Pagos iniciales',
				link: '/dashboard/payment-validate/initial-payments'
			},
			{
				title: 'Pagos de cuota',
				link: '/dashboard/payment-validate/cuote-payments'
			},
			{
				title: 'Pagos de migraciones',
				link: '/dashboard/payment-validate/migration-payments'
			},
			{
				title: 'Pagos pendientes',
				link: '/dashboard/payment-validate/pending-payments'
			},
			{
				title: 'Pagos vencidos',
				link: '/dashboard/payment-validate/late-payments'
			},
			{
				title: 'Recargas de wallet',
				link: '/dashboard/payment-validate/charge-wallet'
			},
			{
				title: 'Carga de movimientos bancarios',
				link: '/dashboard/payment-validate/bank-movement'
			}
		]
	},
	{
		title: 'Solicitudes',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		link: '/requests',
		subMenu: [
			{
				title: 'Solicitudes de transferencia',
				link: '/dashboard/requests/transfer'
			},
			{
				title: 'Solicitudes generales',
				link: '/dashboard/requests/general'
			}
		]
	},
	{
		title: 'Cronogramas',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		link: '/schedule',
		subMenu: [
			{
				title: 'Editar cronogramas',
				link: '/dashboard/schedule/list-schedule'
			}
			/* {
				title: 'Unificar cronogramas',
				link: '/cronogram/union'
			} */
		]
	},

	{
		title: 'Tipo de cambio',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		link: '/change-type',
		subMenu: [
			{
				title: 'General',
				link: '/dashboard/change-type/general'
			}
			// {
			// 	title: 'Detalle',
			// 	link: '/dashboard/change-type/detailed'
			// }
		]
	},
	{
		title: 'Carga de Archivos',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		link: '/file-upload',
		subMenu: [
			{
				title: 'Carga de archivos',
				link: '/dashboard/file-upload/file-upload'
			}
		]
	},
	{
		title: 'Placement',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		link: '/placement',
		subMenu: [
			{
				title: 'Placement',
				link: '/dashboard/placement/placement'
			}
		]
	},
	{
		title: 'Panel coordinador',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		link: '/coordinator-panel',
		subMenu: [
			{
				title: 'Panel coordinador',
				link: '/dashboard/coordinator-panel/general'
			}
		]
	},
	{
		title: 'Gestor de Herramientas',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		link: '/tools',
		subMenu: [
			//{ title: 'Tutoriales', link: '/dashboard/tools/tutorial-manager' },
			{ title: 'Preguntas Frecuentes', link: '/dashboard/tools/frequently-asked-questions' }
		]
	},
	{
		title: 'Soporte',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		link: '/support',
		subMenu: [
			{
				title: 'Soporte',
				link: '/dashboard/support/support'
			}
		]
	},
	{
		title: 'Conciliaciones',
		link: '/conciliations',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		subMenu: [
			{ title: 'Validador', link: '/dashboard/conciliations/validator' },
			{ title: 'Historico', link: '/dashboard/conciliations/historical' }
		]
	},

	/* ------------------ */

	{
		title: 'Administrador de tickets',
		icon: './assets/media/icons/duotune/general/notification.svg',

		link: '/dashboard/transfers/dashboard-transfer',
		subMenu: [
			{
				title: 'Traspasos',
				link: '/dashboard/transfers/dashboard-transfer/requests',
				subMenu: [
					{
						title: 'Solicitudes',
						link: '/dashboard/transfers/dashboard-transfer/requests'
						
					},
					{
						title: 'Histórico',
						link: '/dashboard/transfers/dashboard-transfer/historical'
					}
				]
			}
		]
	},
	/* --------------------------- */
	{
		title: 'Exoneración de renta',
		link: '/exoneration',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		subMenu: [
			{ title: 'Validador', link: '/dashboard/exoneration/validator' },
			{ title: 'Historico', link: '/dashboard/exoneration/historical' }
		]
	},
	{
		title: 'Administrador de Premios',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		link: '/manage-prize',
		subMenu: [
			{ title: 'Creación de Premios', link: '/dashboard/manage-prize/create-prize' },
			{
				title: 'Tipos de Bonos',
				link: '/dashboard/manage-prize/bonus-type/course',
				subMenu: [
					{ title: 'Curso', link: '/dashboard/manage-prize/bonus-type/course' },
					{ title: 'Viajes', link: '/dashboard/manage-prize/bonus-type/travels' },
					{ title: 'Auto', link: '/dashboard/manage-prize/bonus-type/car' },
					{ title: 'Inmueble', link: '/dashboard/manage-prize/bonus-type/estate' }
				]

			 },
			{ title: 'Control de asistencia', link: '/dashboard/manage-prize/attendance-control' },
			{ title: 'Pagos', link: '/dashboard/manage-prize/payments' }

		]
	},
	{
		title: 'Liquidación',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		link: '/liquidations',
		subMenu: [
			{
				title: 'Solicitudes',
				link: '/dashboard/liquidations/requests'
			}
		]
	},
	{
		title: 'Solicitudes de Código Promocional',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		link: '/promotional-code',

		subMenu: [{ title: 'Código Promocional', link: '/dashboard/promotional-code/request' }]
	},
	{
		title: 'Generador de Cheques',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		link: '/checks',

		subMenu: [{ title: 'Cheques', link: '/dashboard/checks/checks' }]
	},
	/* 	NUEVO  MODULO */
	{
		title: 'Legal',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		link: '/legal',
		subMenu: [
			{
				//Vouchers
				//title: 'Solicitud de Legalización',
				title: 'Vouchers', //Solicitud -
				link: '/dashboard/legal/legalization-requests',
				subMenu: [
					{
						title: 'Pendientes',
						link: '/dashboard/legal/legalization-requests/pending-requests'
					},
					{
						title: 'Validadas',
						link: '/dashboard/legal/legalization-requests/validated-requests'
					}
				]
			},
			{
				//Vouchers
				title: 'Rectificación de lugares de recojo',
				link: '/dashboard/legal/pickup-correction',
				subMenu: [
					{
						title: 'Pendientes',
						link: '/dashboard/legal/pickup-correction/pending-pickup'
					},
					{
						title: 'Historicos',
						link: '/dashboard/legal/pickup-correction/historic-pickup'
					}
				]
			},
			{
				//Procesamiento de las Solicitudes de Legalización - Processing of Legalization Requests
				title: 'Procesamiento de las Solicitudes de Legalización',
				link: '/dashboard/legal/process-legal-request',
				subMenu: [
					{
						title: 'Contratos', // contratos validados
						link: '/dashboard/legal/process-legal-request/validated-contracts'
					},
					{
						title: 'Certificados', //certificados validados
						link: '/dashboard/legal/process-legal-request/validated-certificates'
					}
				]
			},
			{
				//Administrador Legal - Legal Administrator
				title: 'Administrador Legal',
				link: '/dashboard/legal/legal-administrator',
				subMenu: [
					{
						title: 'Contratos',
						link: '/dashboard/legal/correction-requests/contracts'
					},
					{
						title: 'Certificados',
						link: '/dashboard/legal/correction-requests/certificates'
					},
					{
						title: 'Solicitudes de Corrección',
						link: '/dashboard/legal/correction-requests/requests'
					},
					{
						title: 'Estados de Legalización', // estados d legalizacion
						link: '/dashboard/legal/legal-administrator/states-legalization'
					},
					{
						title: 'Cronograma', //cronograma
						link: '/dashboard/legal/legal-administrator/timeline-legalization'
					}
				]
			},
			{
				//Gestor de Tarifas Legal - Tarifario
				title: 'Tarifario',
				link: '/dashboard/legal/rate-manager',
				subMenu: [
					/* {
						title: 'Tarifa de penalidad', //
						link: '/dashboard/legal/rate-manager/penalty'
					}, */
					{
						title: 'Tarifa de legalizacion', //
						link: '/dashboard/legal/rate-manager/legalization'
					}
				]
			}
		]
	},
	{
		title: 'Administrador de cupones',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		link: '/coupon-manager',
		subMenu: [
			{ title: 'Descuento de colaborador', link: '/dashboard/coupon-manager/collaborator-discounts' },
			{ title: 'Cupones de socios', link: '/dashboard/coupon-manager/partner-discounts' }
		]
	},
	{
		title: 'Reportes',
		icon: './assets/media/icons/duotune/general/gen022.svg',
		link: '/report',
		subMenu: [
			{ title: 'Dashboard Gerencial', link: '/dashboard/report/management-dashboard' },
			{ title: 'Descargas de tablas', link: '/dashboard/report/table-downloads' }
		]
	}
];
