const { Octokit } = require('@octokit/rest');
const { Client, GatewayIntentBits } = require('discord.js');

const {
  GITHUB_REPOSITORY,
  GITHUB_TOKEN,
  DISCORD_BOT_TOKEN,
  GITHUB_TO_DISCORD_MAP,
} = process.env;

const octokit = new Octokit({ auth: GITHUB_TOKEN });
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function sendDiscordMessage(userId, message) {
  const user = await client.users.fetch(userId);
  const dmChannel = await user.createDM();
  await dmChannel.send(message);
}

(async () => {
  const [owner, repo] = GITHUB_REPOSITORY.split('/');
  const githubToDiscordMap = JSON.parse(GITHUB_TO_DISCORD_MAP);

  const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
    owner,
    repo,
    state: 'open',
  });

  client.once('ready', async () => {
    console.log('Bot is ready.');

    Object.entries(githubToDiscordMap).map(async ([githubUsername, discordUserId]) => {
      const userIssues = issues.filter(
        (issue) => issue.assignee && issue.assignee.login === githubUsername
      );

      if (userIssues.length > 0) {
        const message = [
          `:bell: **Weekly Reminder** :bell:`,
          `You have ${userIssues.length} open issue(s) assigned to you:`,
          ...userIssues.map((issue) => `- [${issue.title}](${issue.html_url})`),
        ].join('\n');

        await sendDiscordMessage(discordUserId, message);
      }
    })

    client.destroy();
  });

  await client.login(DISCORD_BOT_TOKEN);
})();
