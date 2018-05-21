const Markup = require('telegraf/markup');

const router = require('../bot.router');

let routes = [];

for (let key in router.start)
	routes.push(key);

const startMarkup = Markup
										.keyboard(
											[...routes], 
											{
								     		wrap: (btn, index, currentRow) => currentRow.length === 2
								    	}
								    )
								    .oneTime()
   									.resize();

module.exports = startMarkup;