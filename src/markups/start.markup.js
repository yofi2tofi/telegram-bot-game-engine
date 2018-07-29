const Markup = require('telegraf/markup');

const router = require('../bot.router');

function startMarkup(i18n) {
	let routes = [];
	for (let key in router.start) {
		routes.push(i18n.t(router.start[key]));
	}

	return Markup
		.keyboard(
			[...routes], 
			{
				wrap: (btn, index, currentRow) => currentRow.length === 2
			}
		)
		.oneTime()
		.resize();
}

module.exports = startMarkup;