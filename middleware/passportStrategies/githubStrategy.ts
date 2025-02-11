import { Strategy as GitHubStrategy } from 'passport-github';
import { VerifyCallback } from 'passport-oauth2';
import { PassportStrategy } from '../../interfaces/index';
import { Request } from 'express';
import { userModel, FindOneQuery } from '../../models/userModel';
import dotenv from 'dotenv';
dotenv.config();

const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const callbackURL = process.env.GITHUB_CALLBACK_URL;

// console.log('GitHub Environment Variables:');
// console.log('Client ID:', clientID);
// console.log('Client Secret:', clientSecret?.substring(0, 4) + '...');
// console.log('Callback URL:', callbackURL);


const githubStrategy: GitHubStrategy = new GitHubStrategy(
	{
		clientID: clientID || '',
		clientSecret: clientSecret || '',
		callbackURL: callbackURL || 'http://localhost:8000/auth/github/callback',
		passReqToCallback: true,
	},
	async (
		req: Request,
		accessToken: string,
		refreshToken: string,
		profile: any, // Type assertion to handle unknown profile type
		done: VerifyCallback
	) => {
		try {
			const existingUser = await userModel.findOne({
				email: profile.emails?.[0]?.value,
			});

			if (existingUser) {
				return done(null, existingUser);
			} else {
				const newUser = await userModel.createUser({
					name: profile.displayName,
					email: profile.emails?.[0]?.value,
					password: '',
					githubId: profile.id,
					username: profile.username,
					avatar: profile.photos?.[0]?.value,
				});
				return done(null, newUser);
			}
		} catch (error) {
			return done(error);
		}
	}
);

const passportGitHubStrategy: PassportStrategy = {
	name: 'github',
	strategy: githubStrategy,
};

export default passportGitHubStrategy;
