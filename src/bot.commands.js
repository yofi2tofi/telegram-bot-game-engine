const Stage = require('telegraf/stage');
const { enter, leave } = Stage;

module.exports = (bot, i18n) => {
	bot.command('start', enter('start'));
	bot.command('learning', enter('learning'));

	bot.command('en', ({ i18n, scene, reply }) => {
		i18n.locale('en-EN');
		return scene.enter('start');
	});
	
	bot.command('ru', ({ i18n, scene, reply }) => {
		i18n.locale('ru-RU');
		return scene.enter('start');
	});
}