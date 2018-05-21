const Markup = require('telegraf/markup');

const router = require('../bot.router');

let routes = [];

for (let key in router.profile)
	routes.push(key);

const profileMarkup = Markup
											.keyboard(
												[...routes, 'Назад'], 
												{
									     		wrap: (btn, index, currentRow) => currentRow.length === 2
									    	}
									    )
									    .oneTime()
   										.resize();

module.exports = profileMarkup;