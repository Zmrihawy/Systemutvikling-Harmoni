import discord from 'discord.js'


const client = new discord.Client();

client.login('NjY4MDgwODQyMjU3NTk2NDM3.XiMFFg.-rNjWzbj7TwS9v74CMJGJHxnNyg');

client.once('ready', () => {
    client.channels.get('668080630696771604')
    .send('Server online');
});

client.on('message', (message) => {
  if(message.content.startsWith("!status")) return message.reply("Online");
});