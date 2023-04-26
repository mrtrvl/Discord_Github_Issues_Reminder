# Discord Github Issues Reminder

Discord BOT to remind users about open Github Issues

This Node.js script is a Discord bot that sends weekly reminders to users about their open GitHub issues. It also allows users to request a list of their open issues by sending a message in Discord.

## Dependencies:

- **@octokit/rest**: GitHub REST API client for JavaScript.
- **discord.js**: A powerful library for interacting with the Discord API.
- **node-cron**: A task scheduler for running tasks periodically.

## Configuration:

The bot uses a config object, which is imported from a separate module. This object should contain the following keys:

- `githubToken`: GitHub personal access token for accessing the GitHub API.
- `discordBotToken`: Discord bot token for connecting the bot to Discord.
- `githubRepository`: A string in the format "owner/repo" representing the GitHub repository.

```javascript
const config = {
  githubRepository: 'owner/repository',
  githubToken: 'githubTokenWithRepoPermissions',
  discordBotToken: 'discordTokenAsAString',
};
```

## Functions:

- `sendDiscordMessage(userId, message)`: Sends a message to a Discord user with the given user ID.
- `getOpenIssuesForUser(username)`: Fetches open issues assigned to the given GitHub username.
- `sendWeeklyReminders()`: Sends weekly reminders to users about their open GitHub issues.

## Event Handlers:

- `client.on('messageCreate', async (message) => { ... })`: Listens for messages in Discord. When a user sends a message with the content !myissues, the bot will reply with a list of their open GitHub issues.
- `client.once('ready', async () => { ... })`: Executes when the bot is ready. Schedules the sendWeeklyReminders function to run every Friday at 12:00 PM.

## Setting up Discord BOT

Set up a new Discord application:
1. Visit the Discord Developer Portal: https://discord.com/developers/applications
2. Click "New Application" and give it a name.
3. Go to the "Bot" tab and click "Add Bot".

**Get the bot token**: In the "Bot" tab, you can find the bot token. Click "Copy" to copy the token to your clipboard and paste it to `config.js` file as a value to `discordBotToken` key.

Invite the bot to your server:
1. Go to the "OAuth2" tab in your Discord application.
2. Scroll down to "Scopes" and select the "bot" scope.
3. Scroll further down to "Bot Permissions" and select the necessary permissions for your bot (e.g., Send Messages, Read Message History).
4. Copy the generated URL from the "Scopes" section and paste it into your web browser. Follow the prompts to invite the bot to your server.

## Get Github token

**Set up the GitHub token**: Generate a GitHub Personal Access Token by visiting https://github.com/settings/tokens and clicking "Generate new token". Select the appropriate permissions (e.g., repo scope for accessing private repositories) and click "Generate token". Copy the generated token and paste it to `config.js` file as a value to `githubToken` key.

## Installation

- Clone repository: `git clone https://github.com/mrtrvl/Discord_Github_Issues_Reminder.git`
- Go to cloned directory: `cd Discord_Github_Issues_Reminder`
- Install dependencies `npm install`
- Rename `example.config.js` file to `config.js` and update with correct values
- Run script: `node app.js`
