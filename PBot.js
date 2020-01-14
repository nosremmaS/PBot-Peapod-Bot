const Discord = require('discord.js');
const {
        prefix,
        token,
} = require('./config.json');
const ballResponses = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes - definitely.", "You may rely on it.", "Signs point to yes.", "Yes.", "Outlook good.", "Most Likely.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no", "My sources say no.", "Outlook not so good.", "Very doubtful."];
const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready to operate!');
});

client.once('reconnecting', () => {
    console.log('Reconnecting...');
    });

client.once('disconnect', () =>
    console.log('Disconnected, attempting to reconnect...');
});

client.on('ready, () => {
    client.user.setActivity('For commands', { type: 'LISTENING' });
});

// Constants and logging completed. Entering core bot

client.on('message', async message => {
    if (!message.content.startsWith(prefix)) return;
    if (message.author.bot) return;
    // Validating user and messages
    if (message.content === `${prefix}ping)) {
        message.channel.send(`pong!`)
        message.channel.react(`checkered_flag`);
        }
    //"Ping-pong" message for testing if bot is online and ready

    //Setting up the "8-Ball" command

    else if (message.content.startsWith(`?8ball`)) {
    message.channel.send(ballResponses [Math.floor(Math.random()*ballResponses .length )])
    }
    //That's the entire 8-ball command
	//Setting up an avatar command
	else if (message.content === `${prefix}avatar`) {
		message.reply(message.author.avatarURL);
	}


