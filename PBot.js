const Discord = require('discord.js');
const {
        prefix, token,
} = require('./config.json');
const {
	help
} = require('./longcommands.json');
const ytdl = require('ytdl-core');
const client = new Discord.Client();
const queue = new Map();
const ballResponses = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes - definitely.", "You may rely on it.", "Signs point to yes.", "Yes.", "Outlook good.", "Most Likely.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no", "My sources say no.", "Outlook not so good.", "Very doubtful."];

client.once('ready', () => {
        console.log('Ready to operate!');
});

client.once('reconnecting', () => {
        console.log('Reconnecting!');
});

client.once('disconnect', () => {
        console.log('Disconnect!');
});

client.on('ready', () => {
        client.user.setActivity('For Commands', { type: 'LISTENING' });
        });

// Constants and logging completed. Entering core bot

client.on('message', async message => {
    const serverQueue = queue.get(message.guild.id);
    if (!message.content.startsWith(prefix)) return;
    if (message.author.bot) return;
    // Validating user and messages
    if (message.content === `${prefix}ping`) {
        message.channel.send(`pong!`)
        }
    //"Ping-pong" message for testing if bot is online and ready

    //Setting up the "8-Ball" command

    else if (message.content.startsWith(`${prefix}8ball`)) {
    message.channel.send(ballResponses [Math.floor(Math.random()*ballResponses .length )])
    }
    //That's the entire 8-ball command
	//Setting up an avatar command
	else if (message.content === `${prefix}avatar`) {
		message.reply(message.author.avatarURL);
	}

	else if (message.content === `${prefix}help`) {
		message.channel.send(`${help}`);
	}

	else if (message.content === `${prefix}github`) {
		message.channel.send(`https://github.com/nosremmaS/PBot-Peapod-Bot`)
		message.channel.send(`That is my github page! Take a look if you'd like!`);
		}

	else if (message.content === `${prefix}uptime`) {
		message.channel.send(`I have been online for ${Math.floor(client.uptime / 3600000)} hours, ${Math.floor(client.uptime / 60000)} minutes, and ${Math.floor(client.uptime / 1000)} seconds!`)
	}

	else if (message.content.startsWith(`${prefix}play`)) {
		if (message.content.includes(`youtube.`)) {
                	execute(message, serverQueue);
                	return;
       		}
		else return;
	}

	else if (message.content.startsWith(`${prefix}skip`)) {
                skip(message, serverQueue);
                return;
        }
	else if (message.content.startsWith(`${prefix}stop`)) {
                stop(message, serverQueue);
                return
	}

async function execute(message, serverQueue) {
        const args = message.content.split(' ');

        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
                return message.channel.send('I need the permissions to join and speak in your voice channel!');
        }

	const songInfo = await ytdl.getInfo(args[1]);
        const song = {
                title: songInfo.title,
                url: songInfo.video_url,
        };


        if (!serverQueue) {
                const queueContruct = {
                        textChannel: message.channel,
                        voiceChannel: voiceChannel,
                        connection: null,
                        songs: [],
                        volume: 10,
                        playing: true,
                };


                queue.set(message.guild.id, queueContruct);
		queueContruct.songs.push(song);

                try {
                        var connection = await voiceChannel.join();
                        queueContruct.connection = connection;
                        play(message.guild, queueContruct.songs[0]);
                } catch (err) {
                        console.log(err);
                        queue.delete(message.guild.id);
                        return message.channel.send(err);
                }
        } else {
                serverQueue.songs.push(song);
                console.log(serverQueue.songs);
                return message.channel.send(`${song.title} has been added to the queue!`);
        }

};


function skip(message, serverQueue) {
        if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
        if (!serverQueue) return message.channel.send('There is no song that I could skip!');
        serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
        if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
}
        const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', () => {
                        console.log('Music ended!');
                        serverQueue.songs.shift();
                        play(guild, serverQueue.songs[0]);
                })
                .on('error', error => {
                        console.error(error);

});
});

client.login(token);
