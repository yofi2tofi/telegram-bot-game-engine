const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');

const database = require('../bot.db').users;

const language = new Scene('language');

const languages = ['ru-RU', 'en-EN'];

language.enter( async ({ i18n, reply }) => {
  let user, text;
  
  text = i18n.t('selectLanguage');

	return reply(
		text,
		Extra.HTML().markup((m) =>
	    m.inlineKeyboard([
	      [ m.callbackButton('Русский', 'ru-RU') ],
	      [ m.callbackButton('English', 'en-EN') ]
	    ]))
	);
});

languages.forEach((lang) => {
  language.action(lang, async ({ i18n, session, scene, reply, update: { callback_query: { from: { id }}} }) => {
    i18n.locale(lang);
    await database.child(`${id}/system`).update({ selectLanguage: true });
    session.id = id;
    return scene.enter('start');
  });
});

module.exports = language;