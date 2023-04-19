const Command = require(`./module.js`)
const CommandClass = new Command();

const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { token } = process.env;

const prefix = 'c!';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildScheduledEvents,
	],
	partials: [
		Partials.User,
		Partials.Channel,
		Partials.GuildMember,
		Partials.Message,
		Partials.Reaction,
		Partials.GuildScheduledEvent,
		Partials.ThreadMember,
	],
});

client.once('ready', () => {
	console.log('起動完了');
});

client.on('messageCreate', async (message) => {
	if (!message.content.startsWith(prefix)) return
	if (message.author.bot) return;
	const [command, ...args] = message.content.slice(prefix.length).split(/\s+/)


	switch (command) {
		case `balance`:
		case `bal`:
			CommandClass.balance(message);
			break

		case `deposit`:
		case `dep`:
			CommandClass.deposit(message);
			break

		case `withdraw`:
		case `with`:
			CommandClass.withdraw(message);
			break

		case `ping`:
			CommandClass.ping(message);
			break

		case `work`:
			CommandClass.work(message);
			break

		case `send`:
			CommandClass.send(message);
			break

		case `coinflip`:
			CommandClass.CoinFlip(message);
			break
		default:
			message.reply(
				`対応していないcommandです。`
			);
			break
	}
})

client.login(token);