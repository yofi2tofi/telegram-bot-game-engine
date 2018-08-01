const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const { enter, leave } = Stage;
const { match } = require('telegraf-i18n');

const profileMarkup = require('../markups/profile.markup');
const router = require('../bot.router');
const database = require('../bot.db').users;

const statistics = new Scene('statistics');

statistics.enter( async ({ i18n, scene, reply, message: { from : { id } } }) => {
	let user, oilObtain, energyObtain, create,
	text = '';

  user = await database.once('value').then((snapshot) => snapshot.child(id).val() );
  
	oilObtain = user.oilPumps ? user.oilPumps.reduce((prev, key) => prev + +key.point, 0) : 0;
	energyObtain = user.energyPumps ? user.energyPumps.reduce((prev, key) => prev + +key.point, 0): 0;

	create = Math.round((new Date().getTime() - user.created) / (1000 * 60 * 60 * 24));

	text += i18n.t('statisticsUser');
	text += i18n.t('statisticsCompanyLabel', {
		label: user.label
	});
	text += i18n.t('statisticsCompanyAge', {
		age: create
	});
	text += i18n.t('statisticsCompanyGain', {
		oilGain: oilObtain,
		energyGain: energyObtain
	});
	text += i18n.t('statisticsCompanyGainOil', {
		oilBarrels: user.storage.oilBarrels ? user.storage.oilBarrels: 0
	});
	text += i18n.t('statisticsCompanyGainEnergy', {
		energy: user.storage.energy ? user.storage.energy: 0
	});
	text += i18n.t('statisticsCompanyGainRefs', {
		refs: user.system.refferals ? user.system.refferals.length: 0
	});
	text += i18n.t('statisticsCompanyTaskComplete', {
		tasks: user.tasks
	});
	text += i18n.t('statisticsCompanyOwn', {
		parts: user.system.stocks
	});

	reply(
		text,
		Extra.markup(profileMarkup(i18n))
	);
});

for (let key in router.profile) {
	statistics.hears( match(router.profile[key]) , enter(`${router.profile[key]}`));
}

statistics.hears(match('back'), enter('start'));

module.exports = statistics;