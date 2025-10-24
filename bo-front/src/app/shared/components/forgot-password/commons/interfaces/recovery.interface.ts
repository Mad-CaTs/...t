import { AttemptResult, RecoveryMethod, TokenGenerationStatus } from '../enums/recovery.enum';

export interface RemainingTime {
	minutes: number;
	seconds: number;
}

export interface TokenGenerationResult {
	status: TokenGenerationStatus;
	resetTokenId: number | null;
	remainingTime: RemainingTime | null;
}

export interface TokenValidationResult {
	isValidToken: boolean;
	attemptResult: AttemptResult;
}

export interface PasswordRecoveryRequest {
	email: string;
	method: RecoveryMethod;
}

export interface TokenRequest {
	recoveryTokenId: number;
	token: string;
}

export interface PasswordChangeRequest {
	recoveryTokenId: number;
	token: string;
	newPassword: string;
}
