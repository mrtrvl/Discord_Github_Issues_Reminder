const users = require('./users');

const usersService = {
  getAllUsers: () => users,
  getUserByGithubUserName: async (githubUserName) => users.find(
    (user) => user.githubUsername === githubUserName,
  ),
  getUserByEmail: async (email) => users.find(
    (user) => user.email === email,
  ),
  getUserByDiscordId: async (discordId) => users.find(
    (user) => user.discordId === discordId,
  ),
};

module.exports = usersService;
