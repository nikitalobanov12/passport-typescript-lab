import { userModel, FindOneQuery } from '../models/userModel';

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
