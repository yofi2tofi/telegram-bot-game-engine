const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const { enter, leave } = Stage;
const { match } = require('telegraf-i18n');

const texts = require('../texts/texts.json');

const startMarkup = require('../markups/start.markup');
const router = require('../bot.router');
const database = require('../bot.db').users;

const initModel = require('../models/init.model');

const start = new Scene('start');

start.enter( async ({ i18n, scene, session, reply, message }) => {
	const text = message ? message.text: '';
	const id = message ? message.from.id: session.id;

	let user, refUser;

	const keys = text.split(' ');
	if (keys[1]) {
		await database.once('value').then((snapshot) => {
			snapshot.forEach((childSnapshot) => {
				if ( childSnapshot.val().system.refUrl === keys[1]) {
					refUser = childSnapshot.key;
				}
			});
		});
	}

	user = await database.once('value').then((snapshot) => snapshot.child(id).val());

	if (refUser && !user) {
		const key = await database.child(`${refUser}/system/refferals`).push(id);
	}

	if (!user) {
		const initModelExist = new initModel(id);

		if (refUser) {
			initModelExist.system.refferer = refUser;
			initModelExist.holders.push({
				holder: refUser,
				part: 20
			})
		}
	
		await database.child(id).set(initModelExist);
		return scene.enter('language');
	}

	if (!user.system.selectLanguage) {
		return scene.enter('language');
	}

	if (!user.system.isTerm) {
		return scene.enter('agreement');
	}

	//TODO: добавить с инлайн кнопками первый ответ "доска объявлений"
	return reply( i18n.t('start'), Extra.markup( startMarkup(i18n) ) );	
});

for (let key in router.start) {
	start.hears( match(router.start[key]) , enter(`${router.start[key]}`));
}

module.exports = start;