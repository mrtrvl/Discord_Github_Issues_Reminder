# Discord Github Issues Reminder

Discord BOT to remind users about open Github Issues

This Node.js script is a Discord bot that sends weekly reminders to users about their open GitHub issues. It also allows users to request a list of their open issues by sending a message in Discord.

## Dependencies:

- @octokit/rest: GitHub REST API client for JavaScript.
- discord.js: A powerful library for interacting with the Discord API.
- node-cron: A task scheduler for running tasks periodically.

## Configuration:

The bot uses a config object, which is imported from a separate module. This object should contain the following keys:

- `githubToken`: GitHub personal access token for accessing the GitHub API.
- `discordBotToken`: Discord bot token for connecting the bot to Discord.
- `githubRepository`: A string in the format "owner/repo" representing the GitHub repository.
- `githubToDiscordMap`: An object that maps GitHub usernames to Discord user IDs.

```javascript
const config = {
  githubRepository: 'owner/repository',
  githubToken: 'githubTokenWithRepoPermissions',
  discordBotToken: 'discordTokenAsAString',
  githubToDiscordMap: {
    'githubUserName1': 'discordUserId1',
    'githubUserName2': 'discordUserId2',
  },
};
```

## Functions:

- `sendDiscordMessage(userId, message)`: Sends a message to a Discord user with the given user ID.
- `getOpenIssuesForUser(username)`: Fetches open issues assigned to the given GitHub username.
- `sendWeeklyReminders()`: Sends weekly reminders to users about their open GitHub issues.

## Event Handlers:

- `client.on('messageCreate', async (message) => { ... })`: Listens for messages in Discord. When a user sends a message with the content !myissues, the bot will reply with a list of their open GitHub issues.
- `client.once('ready', async () => { ... })`: Executes when the bot is ready. Schedules the sendWeeklyReminders function to run every Friday at 12:00 PM.

## Installation

- Clone repository: `git clone https://github.com/mrtrvl/Discord_Github_Issues_Reminder.git`
- Go to cloned directory: `cd Discord_Github_Issues_Reminder`
- Install dependencies `npm install`
- Rename `example.config.js` file to `config.js` and update with correct values
- Run script: `node app.js`
