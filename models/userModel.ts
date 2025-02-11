interface User {
	id: number;
	name: string;
	email: string;
	password: string;
	githubId?: string;
	username?: string;
	avatar?: string; //string that leads to the picture url
}

interface CreateUserInput {
	name: string;
	email: string;
	password: string;
	githubId?: string;
	username?: string;
	avatar?: string;
}
const database: User[] = [
	{
		id: 1,
		name: 'Jimmy Smith',
		email: 'jimmy123@gmail.com',
		password: 'jimmy123!',
	},
	{
		id: 2,
		name: 'Johnny Doe',
		email: 'johnny123@gmail.com',
		password: 'johnny123!',
	},
	{
		id: 3,
		name: 'Jonathan Chen',
		email: 'jonathan123@gmail.com',
		password: 'jonathan123!',
	},
];

interface FindOneQuery {
	email: string;
}

const userModel = {
	findOne: (query: FindOneQuery) => {
		const user = database.find(user => user.email === query.email);
		if (user) {
			return user;
		}
		throw new Error(`Couldn't find user with email: ${query.email}`);
	},
	findById: (id: number) => {
		const user = database.find(user => user.id === id);
		if (user) {
			return user;
		}
		throw new Error(`Couldn't find user with id: ${id}`);
	},
	createUser: (userData: CreateUserInput): User => {
		const newUser: User = {
			id: database.length + 1,
			name: userData.name,
			email: userData.email,
			password: userData.password,
			githubId: userData.githubId,
			username: userData.username,
			avatar: userData.avatar,
		};
		database.push(newUser);
		return newUser;
	},
};

export { database, userModel, FindOneQuery, CreateUserInput };
