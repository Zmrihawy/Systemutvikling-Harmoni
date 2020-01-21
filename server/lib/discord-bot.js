"use strict";

var _discord = _interopRequireDefault(require("discord.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var client = new _discord["default"].Client();
client.login('NjY4MDgwODQyMjU3NTk2NDM3.XiMFFg.-rNjWzbj7TwS9v74CMJGJHxnNyg');
client.once('ready', function () {
  client.channels.get('668080630696771604').send('Server online');
});
client.on('message', function (message) {
  if (message.content.startsWith("!status")) return message.reply("Online");
});