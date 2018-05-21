const Stage = require('telegraf/stage');
const { enter, leave } = Stage;

module.exports = (bot) => {
	bot.command('start', enter('start'));
}