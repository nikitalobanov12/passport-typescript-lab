import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../interfaces';

//makes sure the user is logged in before showing the dashboard
export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/auth/login');
};

// gets called when the user goes to the login page
export const forwardAuthenticated = (req: Request, res: Response, next: NextFunction) => {
	if (!req.isAuthenticated()) {
		return next();
	}
	res.redirect('/dashboard');
};

//gets called when the user goes to the admin page
export const ensureAdmin = (req: Request, res: Response, next: NextFunction) => {
	if (req.isAuthenticated() && req.user?.admin) return next();
	res.redirect('/dashboard');
}
