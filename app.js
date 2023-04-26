const { Octokit } = require('@octokit/rest');
const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');
const config = require('./config');

const octokit = new Octokit({ auth: config.githubToken });
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

async function sendDiscordMessage(userId, message) {
  const user = await client.users.fetch(userId);
  const dmChannel = await user.createDM();
  await dmChannel.send(message);
}

async function getOpenIssuesForUser(username) {
  const [owner, repo] = config.githubRepository.split('/');
  const response = await octokit.paginate(octokit.rest.issues.listForRepo, {
    owner,
    repo,
    state: 'open',
    assignee: username,
  });
  return response;
}

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content.toLowerCase() === '!myissues') {
    const githubUsername = Object.keys(
      config.githubToDiscordMap,
    ).find((key) => config.githubToDiscordMap[key] === message.author.id);

    if (!githubUsername) {
      message.reply('Your GitHub username is not mapped to your Discord user ID. Please contact an administrator to set up the mapping.');
      return;
    }

    const userIssues = await getOpenIssuesForUser(githubUsername);
    if (userIssues.length > 0) {
      const replyMessage = [
        `You have ${userIssues.length} open issue(s) assigned to you:`,
        ...userIssues.map((issue) => `- [${issue.title}](${issue.html_url})`),
      ].join('\n');
      message.reply(replyMessage);
    } else {
      message.reply('You have no open issues assigned to you.');
    }
  }
});

async function sendWeeklyReminders() {
  // console.log('Sending weekly reminders.');

  const [owner, repo] = config.githubRepository.split('/');
  const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
    owner,
    repo,
    state: 'open',
  });

  // Send weekly reminders
  await Promise.all(
    Object.entries(config.githubToDiscordMap).map(async ([githubUsername, discordUserId]) => {
      const userIssues = issues.filter(
        (issue) => issue.assignee && issue.assignee.login === githubUsername,
      );

      if (userIssues.length > 0) {
        const message = [
          ':bell: **Weekly Reminder** :bell:',
          `You have ${userIssues.length} open issue(s) assigned to you:`,
          ...userIssues.map((issue) => `- [${issue.title}](${issue.html_url})`),
        ].join('\n');

        await sendDiscordMessage(discordUserId, message);
      }
    }),
  );
}

client.once('ready', async () => {
  console.log('Bot is ready.');

  // Schedule weekly reminders to run every Friday at 12:00 PM
  cron.schedule('0 12 * * 5', async () => {
    await sendWeeklyReminders();
  });
});

client.login(config.discordBotToken);
