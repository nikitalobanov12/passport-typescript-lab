import { Strategy } from 'passport';
import { Request } from 'express';

export interface PassportStrategy {
	name: string;
	strategy: Strategy;
}

export interface AuthenticatedRequest extends Request {
	user: any;
}

export interface CustomRequest extends Request {
	isAuthenticated(): this is AuthenticatedRequest;
}	
