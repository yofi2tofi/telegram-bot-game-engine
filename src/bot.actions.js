const Stage = require('telegraf/stage');
const { enter, leave } = Stage;

module.exports = (bot) => {
	// bot.action(/.+/, enter('start'));
	bot.action(/.+/, () => {
		console.log('empty route');
	});
}