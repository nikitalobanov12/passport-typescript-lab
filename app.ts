import dotenv from 'dotenv';
dotenv.config();

// console.log('GITHUB_CLIENT_ID exists:', !!process.env.GITHUB_CLIENT_ID);
// console.log('GITHUB_CLIENT_SECRET exists:', !!process.env.GITHUB_CLIENT_SECRET);
// console.log('GITHUB_CALLBACK_URL:', process.env.GITHUB_CALLBACK_URL);
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import path from 'path';
import passportMiddleware from './middleware/passportMiddleware';
import adminRoute from './routes/adminRoute';

const port = process.env.port || 8000;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(
	session({
		secret: 'secret',
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			secure: false,
			maxAge: 24 * 60 * 60 * 1000,
		},
	})
);

import authRoute from './routes/authRoute';
import indexRoute from './routes/indexRoute';

// Middleware for express
app.use(express.json());
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
passportMiddleware(app);

app.use((req, res, next) => {
	console.log(`User details are: `);
	console.log(req.user);

	console.log('Entire session object:');
	console.log(req.session);

	console.log(`Session details are: `);
	console.log((req.session as any).passport);
	next();
});

app.use('/', indexRoute);
app.use('/auth', authRoute);
app.use('/admin', adminRoute);

app.listen(port, () => {
	console.log(`🚀 Server has started on port ${port}`);
});
