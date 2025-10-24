export interface NextPayment {
   idPayment: number;
    idSuscription: number;
    quoteDescription: string;
    nextExpirationDate: string; 
    dollarExchange: number;
    quoteUsd: number;
    percentage: number;
    idStatePayment: number;
    obs: string;
    payDate: string | null;
    pts: number;
    isInitialQuote: number;
    positionOnSchedule: number;
    numberQuotePay: number;
    amortizationUsd: number;
    capitalBalanceUsd: number;
    totalOverdue: number | null;
    idPercentOverduedetail: number; 
}

export interface ApiResponse<T> {
    result: boolean;
    data: T;           
    timestamp: string;
    status: number;
}