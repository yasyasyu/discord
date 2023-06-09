const fs = require("fs")
const { Client, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();
const Keyv = require('keyv')
const { token } = process.env;
const cmdCD = require('command-cooldown');

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

const moneys = new Keyv('sqlite://db.sqlite', { table: 'moneys' })
moneys.on('error', err => console.error('Keyv connection error:', err))

client.on('messageCreate', async (message) => {
	if (!message.content.startsWith(prefix)) return
	if (message.author.bot) return;
	const [command, ...args] = message.content.slice(prefix.length).split(/\s+/)


	switch (command) {
		case `balance`:
		case `bal`:
			balance(message);
			break

		case `deposit`:
		case `dep`:
			deposit(message);
			break

		case `withdraw`:
		case `with`:
			withdraw(message);
			break

		case `ping`:
			ping(message);
			break

		case `work`:
			work(message);
			break

		case `send`:
			send(message);
			break

		case `coinflip`:
			CoinFlip(message);
			break
		default:
			message.reply(
				`対応していないcommandです。`
			);
			break
	}
})

client.login(token);

async function balance(message) {
	const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
	message.reply(
		`<@${message.author.id}>のお金💴\n${"```"}js\n＊手持ちのお金:${money.cash}円👛\n＊銀行のお金:${money.bank}円🏧${"```"}`
	);
	moneys.set(message.author.id, money)

}

async function deposit(message) {
	const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
	const [command, ...args] = message.content.slice(prefix.length).split(/\s+/)

	const [amount] = args.map(str => Number(str))
	if (money.cash < amount) {
		message.reply(
			`${"```"}＊手持ちのお金が足りません💸${"```"}`
		);
		return;
	}

	if (amount >= 1) {
		money.bank += amount;
		money.cash -= amount;
		message.reply(
			`${"```"}js\n＊入金したお金:${amount}円\n＊現在の銀行の合計金額:${money.bank}円${"```"}`
		);
	}
	else {
		message.reply(
			`${"```"}js\n＊入金したい金額を書いてください(一円以上)\n＊コマンド : c!deposit <入金したい金額>${"```"}`
		);
	}
	moneys.set(message.author.id, money)
}

async function withdraw(message) {
	const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
	const [command, ...args] = message.content.slice(prefix.length).split(/\s+/)

	const [amount] = args.map(str => Number(str))
	if (money.bank < amount) {
		message.reply(
			`${"```"}＊銀行のお金が足りません💸${"```"}`
		);
		return;
	}

	if (amount >= 1) {
		money.cash += amount;
		money.bank -= amount;
		message.reply(
			`${"```"}js\n＊出金したお金:${amount}円\n＊現在の銀行の合計金額:${money.bank}円${"```"}`
		);
	}
	else {
		message.reply(
			`${"```"}＊出金したい金額を書いてください(一円以上)\n＊コマンド : c!withdraw <出金したい金額>${"```"}`
		);
	}
	moneys.set(message.author.id, money)

}

async function ping(message) {
	let cd = await cmdCD.checkCoolDown(message.author.id, "cmd-ping");
	if (cd.res.spam) return;
	if (!cd.res.ready) return message.reply(`${"```"}js\n🤖そのコマンドが使えるまであと ${(cd.res.rem / 1000).toFixed(1)}秒🚀${"```"}`);
	message.reply(`${"```"}ポン！🏓${client.ws.ping}Ms${"```"}`);
	cmdCD.addCoolDown(message.author.id, 5000, "cmd-ping");
}

async function work(message) {
	const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
	let cd = await cmdCD.checkCoolDown(message.author.id, "cmd-work");
	if (!cd.res.ready) return message.reply(`${"```"}js\n＊🤖そのコマンドは一時間のクールダウンの後に使えます🚀\n残り${(cd.res.rem / 1000 / 60).toFixed(1)}分${"```"}`);
	var randomWork = 1000 + Math.floor(Math.random() * 5000);
	money.cash += randomWork;
	message.reply(
		`${"```"}＊地下労働して${randomWork}円を手に入れた！💸${"```"}`
	);
	cmdCD.addCoolDown(message.author.id, 3600000, "cmd-work");
	moneys.set(message.author.id, money)
}

async function send(message) {
	const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
	const [command, ...args] = message.content.slice(prefix.length).split(/\s+/)

	const [amount] = args.map(str => Number(str)); console.log(amount);
	if (message.mentions.members.size !== 1) return message.channel.send('メンバーを1人指定してください')
	const target = await message.mentions.members.first()
	const targetMoney = (await moneys.get(target.id)) || { cash: 5000, bank: 0 };
	if (Number.isNaN(amount)) return message.reply('相手に渡す金額を指定してください')
	if (money.cash < amount) return message.reply('所持金足りない')
	money.cash -= amount;
	targetMoney.cash += amount;

	message.reply(`${amount}円を${target}に送りました`)
	moneys.set(message.author.id, money)
	moneys.set(target.id, targetMoney)
}

async function CoinFlip(message) {
	const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
	const [command, ...args] = message.content.slice(prefix.length).split(/\s+/)

	const [amount, choice] = args.map(str => Number(str))
	if (!choice == 1 || !choice == 2) {
		message.reply(
			`${"```"}＊表か裏を選んでください\n＊コマンド : c!coinflip <BETしたい金額> <表なら1裏なら2>${"```"}`
		);
		return
	}
	if (money.cash < amount) {
		message.reply(
			`${"```"}＊手持ちのお金が足りません💸${"```"}`
		);
	}
	money.cash -= amount;
	const side = Math.floor(Math.random() * 2 + 1);
	if (choice == side) {
		money.cash += amount * 2;
		message.reply(
			`${"```"}＊YOU WIN!🤑\n${amount * 2}円を手に入れました！💴${"```"}`
		);

	}
	else if (choice !== side) {
		message.reply(
			`${"```"}＊YOU LOOSE...${"(´；ω；`)ｳｯ…"}\n${amount}円を失いました💸${"```"}`
		);
	}
	moneys.set(message.author.id, money)
}