export interface IResponseData<T> {
	readonly result: boolean;
	readonly data: T;
	readonly timestamp: string;
	readonly status: number;
}
