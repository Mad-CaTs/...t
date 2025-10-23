export interface FrequentlyAskedQuestion {
	id: number;
	usermember: string;
	question: string;
	description: string;
	suggested: boolean;
	imageurl: string;
	imageFile?: File;
}

export interface FrequentlyAskedQuestionRequest {
	usermember: string;
	question: string;
	description: string;
	suggested: boolean;
	imageurl: string;
	imageFile?: File;
}
