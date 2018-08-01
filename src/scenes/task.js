const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const { enter, leave } = Stage;
const { match } = require('telegraf-i18n');

const taskText = require('../texts/tasks.json');

const router = require('../bot.router');
const database = require('../bot.db').users;

const task = new Scene('task');

task.enter( async ({ i18n, scene, reply, message: { from : { id } } }) => {
	let user;

	await database.once('value').then((snapshot) => user = snapshot.child(id).val() );

	return reply( 
		i18n.t(taskText[`level${user.level}`].text),
		Extra.HTML().markup((m) =>
	    m.inlineKeyboard([
	      m.callbackButton(i18n.t('checkTask'), 'checkTask')
	    ]))
	);
});

task.action('checkTask', async ({ i18n, answerCbQuery, update: { callback_query: { from: { id }}} }) => {
	let user, field;

	await database.once('value').then((snapshot) => user = snapshot.child(id).val() );

	field = taskText[`level${user.level}`].check;

	if ( !!user[field] )
		return answerCbQuery(i18n.t(taskText[`level${user.level}`].success), true);

	return answerCbQuery(i18n.t('taskError'), true);
});

for (let key in router.profile) {
	task.hears( match(router.profile[key]) , enter(`${router.profile[key]}`));
}

task.hears(match('back'), enter('start'));

module.exports = task;