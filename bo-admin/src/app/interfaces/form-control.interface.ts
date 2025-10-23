export interface ISelectOptReason extends ISelectOpt{
	readonly typeReason: number;
}

export interface ISelectOptPercent extends ISelectOpt {
	levelUser: number;
}

export interface ISelectOpt {
	readonly id: string;
	readonly text: string;
}
