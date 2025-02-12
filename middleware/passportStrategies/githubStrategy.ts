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
		scope: ['user:email'],
		passReqToCallback: true,
	},
	async (req: Request, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) => {
		try {
			console.log('github profile:', {
				id: profile.id,
				displayName: profile.displayName,
				emails: profile.emails,
				username: profile.username,
			});
			const email = profile.emails?.[0]?.value;

			if (!email) {
				console.log('No email found in github profile');
				const username = profile.username;
				const githubEmail = `${username}@github.com`;
				try {
					const existingUser = userModel.findOne({
						email: githubEmail,
					});
					return done(null, existingUser);
				} catch (error) {
					const newUser = userModel.createUser({
						name: profile.displayName || profile.username,
						email: githubEmail,
						password: '', // GitHub users don't need password
						githubId: profile.id,
						username: profile.username,
						admin: false,
					});
					return done(null, newUser);
				}
			} else {
				const newUser = userModel.createUser({
					name: profile.displayName,
					email: profile.emails?.[0]?.value,
					password: '',
					githubId: profile.id,
					username: profile.username,
					admin: false,
				});
				return done(null, newUser);
			}
		} catch (error) {
			return done(error as Error);
		}
	}
);

const passportGitHubStrategy: PassportStrategy = {
	name: 'github',
	strategy: githubStrategy,
};

export default passportGitHubStrategy;
