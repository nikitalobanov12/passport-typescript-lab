import { userModel, FindOneQuery } from '../models/userModel';

//gets called in localstrategy.ts when the user submits the login form
const getUserByEmailIdAndPassword = (email: FindOneQuery, password: string) => {
	const user = userModel.findOne(email);
	if (isUserValid(user, password)) return user;
	else throw new Error('invalid password');
};
const getUserById = (id: any) => {
	let user = userModel.findById(id);
	if (user) {
		return user;
	}
	return null;
};

function isUserValid(user: any, password: string) {
	return user.password === password;
}

export { getUserByEmailIdAndPassword, getUserById };
