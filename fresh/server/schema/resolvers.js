const { UserList, MovieList } = require('../FakeData');
const _ = require('lodash');

const resolvers = {
	Query: {
		users: (aprent, args, context, info) => {
			// console.log(context.req.headers);
			// console.log(info);
			if (UserList) return { users: UserList };

			return { message: 'Yo there was an error' };
		},
		user: (parent, args, context, info) => {
			const id = args.id;
			const user = UserList.find((user) => {
				return user.id === +id;
			});
			return user;
		},
		movies: () => {
			return MovieList;
		},
		movie: (_, args) => {
			const name = args.name;
			const movie = MovieList.find((movie) => {
				return movie.name === name;
			});
			return movie;
		},
	},
	User: {
		favouriteMovies: () => {
			return MovieList.filter((movie) => {
				return (
					movie.yearOfPublication >= 2000 && movie.yearOfPublication <= 2010
				);
			});
		},
	},
	Mutation: {
		createUser: (parent, args) => {
			const user = args.input;
			const lastId = UserList[UserList.length - 1].id;
			user.id = lastId + 1;
			UserList.push(user);
			// console.log(user);
			return user;
		},
		updateUsername: (parent, args) => {
			const { id, newUsername } = args.input;
			let userUpdated;
			UserList.forEach((user) => {
				if (user.id === +id) {
					user.username = newUsername;
					userUpdated = user;
				}
			});
			return userUpdated;
		},
		deleteUser: (parent, args) => {
			const thisId = +args.id;
			const index = UserList.map((user) => {
				return user.id;
			}).indexOf(thisId);
			UserList.splice(index, 1);
			return null;
		},
	},

	UsersResult: {
		__resolveType(obj) {
			if (obj.users) {
				return 'UsersSuccessfulResult';
			}
			if (obj.message) {
				return 'UsersErrorResult';
			}

			return null;
		},
	},
};

module.exports = { resolvers };
