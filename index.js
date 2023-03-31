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

//bank
client.on('messageCreate', async (message) => {
	if (!message.content.startsWith(prefix)) return
	if (message.author.bot) return;
	const [command, ...args] = message.content.slice(prefix.length).split(/\s+/)
	//balance
	if (command === `balance`) {
		const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
		message.reply(
			`<@${message.author.id}>のお金💴\n${"```"}js\n＊手持ちのお金:${money.cash}円👛\n＊銀行のお金:${money.bank}円🏧${"```"}`
		);
		moneys.set(message.author.id, money)
	}
	else if (command === `bal`) {
		const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
		message.reply(
			`<@${message.author.id}>のお金💴\n${"```"}js\n＊手持ちのお金:${money.cash}円👛\n＊銀行のお金:${money.bank}円🏧${"```"}`
		);
		moneys.set(message.author.id, money)
	}

	//deposit
	if (command === `deposit`) {
		const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
		const [a] = args.map(str => Number(str))
		if (money.cash < a) {
			message.reply(
				`${"```"}＊手持ちのお金が足りません💸${"```"}`
			);
			return;
		}

		if (a >= 1) {
			money.bank += a;
			money.cash -= a;
			message.reply(
				`${"```"}js\n＊入金したお金:${a}円\n＊現在の銀行の合計金額:${money.bank}円${"```"}`
			);
		}
		else {
			message.reply(
				`${"```"}js\n＊入金したい金額を書いてください(一円以上)\n＊コマンド : c!deposit <入金したい金額>${"```"}`
			);
		}
		moneys.set(message.author.id, money)
	}

	else if (command === `dep`) {
		const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
		const [a] = args.map(str => Number(str))
		if (money.cash < a) {
			message.reply(
				`${"```"}＊手持ちのお金が足りません💸${"```"}`
			);
			return;
		}

		if (a >= 1) {
			money.bank += a;
			money.cash -= a;
			message.reply(
				`${"```"}js\n＊入金したお金:${a}円\n＊現在の銀行の合計金額:${money.bank}円${"```"}`
			);
		}
		else {
			message.reply(
				`${"```"}＊入金したい金額を書いてください(一円以上)\n＊コマンド : c!deposit <入金したい金額>${"```"}`
			);
		}
		moneys.set(message.author.id, money)
	}

	//withdraw
	if (command === `withdraw`) {
		const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
		const [a] = args.map(str => Number(str))
		if (money.bank < a) {
			message.reply(
				`${"```"}＊銀行のお金が足りません💸${"```"}`
			);
			return;
		}

		if (a >= 1) {
			money.cash += a;
			money.bank -= a;
			message.reply(
				`${"```"}js\n＊出金したお金:${a}円\n＊現在の銀行の合計金額:${money.bank}円${"```"}`
			);
		}
		else {
			message.reply(
				`${"```"}＊出金したい金額を書いてください(一円以上)\n＊コマンド : c!withdraw <出金したい金額>${"```"}`
			);
		}
		moneys.set(message.author.id, money)
	}
	else if (command === `with`) {
		const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
		const [a] = args.map(str => Number(str))
		if (money.bank < a) {
			message.reply(
				`${"```"}＊銀行のお金が足りません💸${"```"}`
			);
			return;
		}

		if (a >= 1) {
			money.cash += a;
			money.bank -= a;
			message.reply(
				`${"```"}js\n＊出金したお金:${a}円\n＊現在の銀行の合計金額:${money.bank}円${"```"}`
			);
		}
		else {
			message.reply(
				`${"```"}＊出金したい金額を書いてください(一円以上)\n＊コマンド : c!withdraw <出金したい金額>${"```"}`
			);
		}
		moneys.set(message.author.id, money)
	}
	//ping
	if (command === `ping`) {
		let cd = await cmdCD.checkCoolDown(message.author.id, "cmd-ping");
		if (cd.res.spam) return;
		if (!cd.res.ready) return message.reply(`${"```"}js\n🤖そのコマンドが使えるまであと ${(cd.res.rem / 1000).toFixed(1)}秒🚀${"```"}`);
		message.reply(`${"```"}ポン！🏓${client.ws.ping}Ms${"```"}`);
		cmdCD.addCoolDown(message.author.id, 5000, "cmd-ping");
	}
	//work
	if (command === `work`) {
		const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
		let cd = await cmdCD.checkCoolDown(message.author.id, "cmd-work");
		if (!cd.res.ready) return message.reply(`${"```"}js\n＊🤖そのコマンドは一時間のクールダウンの後に使えます🚀\n残り${(cd.res.rem / 1000 / 60).toFixed(1)}分${"```"}`);
		var randomwork = 1000 + Math.floor(Math.random() * 5000);
		money.cash += randomwork;
		message.reply(
			`${"```"}＊地下労働して${randomwork}円を手に入れた！💸${"```"}`
		);
		cmdCD.addCoolDown(message.author.id, 3600000, "cmd-work");
		moneys.set(message.author.id, money)
	}
	//give
	if (command === `send`) {
		const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
		const [a] = args.map(str => Number(str)); console.log(a);
		if (message.mentions.members.size !== 1) return message.channel.send('メンバーを1人指定してください')
		const target = await message.mentions.members.first()
		const targetmoney = (await moneys.get(target.id)) || { cash: 5000, bank: 0 };
		if (Number.isNaN(a)) return message.reply('相手に渡す金額を指定してください')
		if (money.cash < a) return message.reply('所持金足りない')
		money.cash -= a;
		targetmoney.cash += a;

		message.reply(`${a}円を${target}に送りました`)
		moneys.set(message.author.id, money)
		moneys.set(target.id, targetmoney)
	}
	//coinflip
	if (command === `coinflip`) {
		const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
		const [a, b] = args.map(str => Number(str))
		if (!b == 1 || !b == 2) {
			message.reply(
				`${"```"}＊表か裏を選んでください\n＊コマンド : c!coinflip <BETしたい金額> <表なら1裏なら2>${"```"}`
			);
			return
		}
		if (money.cash < a) {
			message.reply(
				`${"```"}＊手持ちのお金が足りません💸${"```"}`
			);
		}
		money.cash -= a;
		const side = Math.floor(Math.random() * 2 + 1);
		if (b == side) {
			money.cash += a * 2;
			message.reply(
				`${"```"}＊YOU WIN!🤑\n${a * 2}円を手に入れました！💴${"```"}`
			);

		}
		else if (b !== side) {
			message.reply(
				`${"```"}＊YOU LOOSE...${"(´；ω；`)ｳｯ…"}\n${a}円を失いました💸${"```"}`
			);
		}
		moneys.set(message.author.id, money)
	}
})

client.login(token);