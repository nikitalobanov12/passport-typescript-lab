import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../interfaces';

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/auth/login');
};

export const forwardAuthenticated = (req: Request, res: Response, next: NextFunction) => {
	if (!req.isAuthenticated()) {
		return next();
	}
	res.redirect('/dashboard');
};

export const ensureAdmin = (req: Request, res: Response, next: NextFunction) => {
	if (req.isAuthenticated() && req.user?.admin) return next();
	res.redirect('/dashboard');
}
