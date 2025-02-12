declare global {
	namespace Express {
		interface User {
			id: number;
			name: string;
			admin: boolean;
			email?: string;
			password?: string;
		}
	}
}
export {};

import session from 'express-session';

declare module 'express-session' {
	export interface SessionData {
		passport: any;
	}
}
