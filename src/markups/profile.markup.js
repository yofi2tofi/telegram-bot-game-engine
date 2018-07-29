const Markup = require('telegraf/markup');

const router = require('../bot.router');

function profileMarkup(i18n) {
	let routes = [];
	for (let key in router.profile) {
		routes.push(i18n.t(router.profile[key]));
	}

	return Markup
		.keyboard(
			[...routes, i18n.t('back')], 
			{
				wrap: (btn, index, currentRow) => currentRow.length === 2
			}
		)
		.oneTime()
		.resize();
}

module.exports = profileMarkup;