if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const tmi = require('tmi.js');
const https = require('https');

const client = new tmi.Client({
	connection: {
		secure: true,
		reconnect: true
	},
	identity: {
		username: process.env.BOT_USERNAME,
		password: process.env.OAUTH_TOKEN
	},
	channels: [process.env.CHANNEL_NAME]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
	if (self) return;

	const commandName = message.trim();

	if (commandName === '!ban') {
		client.say(channel, 'Ban command triggered!');
		banBot(tags['user-id'], channel)
	}
});

function banBot(userId, channel) {
	https.get(process.env.BOT_LIST_URL, (res) => {
		const { statusCode } = res;

		let error;
		if (statusCode !== 200) {
			error = new Error(`Request Failed.\n Status Code: ${statusCode}`);
		} 

		if (error) {
			console.error(error.message);
			res.resume();
			return;
		}

		res.setEncoding('utf8')
		let rawData = '';
		res.on('data', (chunk) => { rawData += chunk; });
		res.on('end', () => {
			try {
				var response = JSON.parse(rawData);
				var i = 0;
				var interval = setInterval(function() {
					var nickname = response[i];
					client.say(channel, `/ban ${nickname}`);
					i++;
					if (i === response.length) clearInterval(interval)
				}, 500);
			} catch(e) {
				console.error(e.message);
			}
		});
	});
}