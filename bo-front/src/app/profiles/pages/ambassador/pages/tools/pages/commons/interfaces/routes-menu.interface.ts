/* export interface RoutesMenu {
  name_icon: string;
  name_link: string;
  url: string;
} */

export interface StepRouteMap {
	[key: number]: string;
}

export interface ICardData {
	id: number;
	title: string;
	path: string;
	imagePath: string;
}

export interface ICardDataImgDoc {
	content: string;
	title: string;
	icon: string;
	/* 	prueba: string;
	 */ id: number;
	buttonText?: string;
}
