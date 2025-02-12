interface CreateUserInput {
	name: string;
	email: string;
	password: string;
	admin: boolean
	githubId?: string;
	username?: string;
	avatar?: string;
}
const database: Express.User[] = [
	{
		id: 1,
		name: 'Jimmy Smith',
		email: 'jimmy123@gmail.com',
		password: 'jimmy123!',
		admin: false,
	},
	{
		id: 2,
		name: 'Johnny Doe',
		email: 'johnny123@gmail.com',
		password: 'johnny123!',
		admin: false,
	},
	{
		id: 3,
		name: 'Jonathan Chen',
		email: 'jonathan123@gmail.com',
		password: 'jonathan123!',
		admin: true,
	},
	{
		//easy to remember admin login
		id: 4,
		name: 'admin user', 
		email: 'admin@g.com',
		password: 'admin',
		admin: true,
	},		
	{
		//easy user login
		id:5, 
		name: 'vins', 
		email: 'vins@vins.com', 
		password: 'vins', 
		admin: false,
	}
];

interface FindOneQuery {
	email: string;
}

const userModel = {
	findOne: (query: FindOneQuery) => {
		const user = database.find(user => user.email === query.email);
		if (user) return user;
		else throw new Error(`couldn't find user with email ${query.email}`);
	},
	findById: (id: number) => {
		const user = database.find(user => user.id === id);
		if (user) return user;

		throw new Error(`Couldn't find user with id: ${id}`);
	},
	createUser: (userData: CreateUserInput): Express.User => {
		const newUser: Express.User = {
			id: database.length + 1,
			name: userData.name,
			admin: false,
			email: userData.email,
			password: userData.password,
		};
		database.push(newUser);
		return newUser;
	},
};

export { database, userModel, FindOneQuery, CreateUserInput };
