const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const { enter, leave } = Stage;
const { match } = require('telegraf-i18n');

const profileMarkup = require('../markups/profile.markup');
const router = require('../bot.router');
const database = require('../bot.db').users;

const referrals = new Scene('referrals');

referrals.enter( async ({ i18n, scene, reply, message: { from : { id } } }) => {
  let user,
  link = 'http://t.me/yofi2tofibot?start=',
  text = '';

  user = await database.once('value').then((snapshot) => snapshot.child(id).val() );

  text += i18n.t('referralsLink', {
    refs: user.system.refferals ? user.system.refferals.length: 0,
    refLink: link + user.system.refUrl 
  });

	reply(
		text,
		Extra.HTML().markup(profileMarkup(i18n))
	);
});

for (let key in router.profile) {
	referrals.hears( match(router.profile[key]) , enter(`${router.profile[key]}`));
}

referrals.hears(match('back'), enter('start'));

module.exports = referrals;