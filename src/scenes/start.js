const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const { enter, leave } = Stage;

const texts = require('../texts/texts.json');

const startMarkup = require('../markups/start.markup');
const router = require('../bot.router');
const database = require('../bot.db').users;

const start = new Scene('start');

start.enter( async ({ reply, message: { from : { id } } }) => {

	let isHasChild = await database.once('value').then((snapshot) => snapshot.hasChild(`${id}`) );

	if ( !isHasChild ){
	  await database.child(id).set({ time: new Date().getTime() }); //TODO: в set модель начальный данных
	}

	return reply( texts.start, Extra.markup( startMarkup ) ); // TODO: на место текста вступительный текст
});

for (let key in router.start) {
	const regExp = new RegExp(key, 'ig');
	start.hears( regExp , enter(`${router.start[key]}`));
}

module.exports = start;