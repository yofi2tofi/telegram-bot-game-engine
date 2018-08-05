const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');

const database = require('../bot.db').users;

const agreement = new Scene('agreement');

agreement.enter( async (ctx) => {
  const i18n = ctx.i18n;
  const reply = ctx.reply;

  let user, text;
  
  text = i18n.t('termOfUse');

	return reply(
		text,
		Extra.HTML().markup((m) =>
	    m.inlineKeyboard([
	      [ m.callbackButton(i18n.t('agree'), 'agree') ],
	      [ m.callbackButton(i18n.t('notAgree'), 'notAgree') ]
	    ]))
	);
});

agreement.action('agree', async ({ i18n, session, scene, reply, update: { callback_query: { from: { id }}} }) => {  
  await database.child(`${id}/system`).update({ isTerm: true });
  session.id = id;
  return scene.enter('start');
});

agreement.action('notAgree', async ({ i18n, scene, reply, update: { callback_query: { from: { id }}} }) => {  
  return reply(i18n.t('forbidden'));
});

module.exports = agreement;