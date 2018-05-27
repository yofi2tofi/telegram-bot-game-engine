const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const { enter, leave } = Stage;

const texts = require('../texts/texts.json');

const startMarkup = require('../markups/start.markup');
const router = require('../bot.router');
const database = require('../bot.db').users;

const initModel = require('../models/init.model');

const start = new Scene('start');

start.enter( async ({ scene, reply, message: { from : { id } } }) => {
	let user;

	await database.once('value').then((snapshot) => user = snapshot.child(id).val() );

	if ( !user ) {
	  await database.child(id).set( new initModel() );
	  return scene.enter('learning');
	}

	//TODO: добавить с инлайн кнопками первый ответ "доска объявлений"
	return reply( texts.start, Extra.markup( startMarkup ) );	
});

for (let key in router.start) {
	const regExp = new RegExp(key, 'ig');
	start.hears( regExp , enter(`${router.start[key]}`));
}

module.exports = start;