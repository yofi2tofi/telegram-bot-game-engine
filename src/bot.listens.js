const Stage = require('telegraf/stage');
const { enter, leave } = Stage;

const router = require('./bot.router');

module.exports = (bot) => {
	for (let key in router)
		for ( let prop in router[key]) {
			const regExp = new RegExp(key, 'ig');
			bot.hears( regExp , enter(`${router[key][prop]}`));
		}
}