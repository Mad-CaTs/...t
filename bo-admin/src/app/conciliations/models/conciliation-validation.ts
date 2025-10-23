export class StatementValidateRequest {
    idStatement: number;
    isAcceptedStatement: boolean;
    idReasonRejected: number | null;
    detail: string | null;
}