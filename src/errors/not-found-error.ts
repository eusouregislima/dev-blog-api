import { AppError } from './app-error';

export class NotFoundError extends AppError {
	constructor(message?: string) {
		super(message || 'Not found Error.', 404);
	}
}
