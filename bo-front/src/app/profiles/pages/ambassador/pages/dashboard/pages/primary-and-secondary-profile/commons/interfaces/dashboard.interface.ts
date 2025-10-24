export interface IPointKafka {
	readonly id: number;
	readonly tipo: string;
}

export class PointKafkaBody {
	id: number;
	tipo: string;
}

export interface InvestorPoints {
	actualPoints: number;
	totalPosiblePoints: number;
	percetangeTotal: number;
	pointsThisMonth: number;
}

export interface Colors {
	idColor: number,
	idRange: number,
	color: string,
	textColor: string,
	name: string
} 