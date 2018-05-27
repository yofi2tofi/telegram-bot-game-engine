const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const { enter, leave } = Stage;

const taskText = require('../texts/tasks.json');

const router = require('../bot.router');
const database = require('../bot.db').users;

const task = new Scene('task');

task.enter( async ({ scene, reply, message: { from : { id } } }) => {
	let user;

	await database.once('value').then((snapshot) => user = snapshot.child(id).val() );

	return reply( 
		taskText[`level${user.level}`].text, 
		Extra.HTML().markup((m) =>
	    m.inlineKeyboard([
	      m.callbackButton('🖋 Проверить задание', 'checkTask')
	    ])) 
	);
});

task.action('checkTask', async ({ answerCbQuery, update: { callback_query: { from: { id }}} }) => {
	let user, field;

	await database.once('value').then((snapshot) => user = snapshot.child(id).val() );

	field = taskText[`level${user.level}`].check;

	if ( !!user[field] )
		return answerCbQuery(taskText[`level${user.level}`].success, true);

	return answerCbQuery(`Задание еще не выполненно`, true);
});

for (let key in router.profile) {
	const regExp = new RegExp(key, 'ig');
	task.hears( regExp , enter(`${router.profile[key]}`));
}

task.hears(/Назад/gi, enter('start'));

module.exports = task;