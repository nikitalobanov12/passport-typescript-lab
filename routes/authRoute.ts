import express from 'express';
import passport from 'passport';
import { forwardAuthenticated } from '../middleware/checkAuth';

const router = express.Router();

router.get('/login', forwardAuthenticated, (req, res) => {
	res.render('login');
});

// router.post(
// 	'/login',
// 	passport.authenticate('local', {
// 		successRedirect: '/dashboard',
// 		failureRedirect: '/auth/login',
// 		/* : 😭 failureMsg needed when login fails */
// 		failureMessage: true,
// 	})
// );

router.post('/login', (req, res, next) => {
	passport.authenticate('local', (err: any, user: Express.User, info: any) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.render('login', { error: info.message });
		}
		req.logIn(user, err => {
			if (err) {
				return next(err);
			}
			return res.redirect('/dashboard');
		});
	})(req, res, next);
});

router.get('/logout', (req, res) => {
	req.logout(err => {
		if (err) console.log(err);
	});
	res.redirect('/auth/login');
});

router.get(
	'/github',
	passport.authenticate('github', {
		scope: ['user:email', 'read:user'],
		
	})
);

router.get(
	'/github/callback',
	passport.authenticate('github', {
		successRedirect: '/dashboard',
		failureRedirect: '/auth/login',
		failureMessage: true,
	}), 
	(err:any, req:any, res:any, next:any) => {
		if (err.name === 'TokenError') {
			return res.redirect('/auth/login')
		}
		return next(err)
	}
);

export default router;
