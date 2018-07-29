const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const { enter, leave } = Stage;
const { match } = require('telegraf-i18n');

const profileMarkup = require('../markups/profile.markup');
const router = require('../bot.router');

const profile = new Scene('profile');

profile.enter( ({ i18n, reply }) => reply( 
	'Custom buttons keyboard for profile page',
	Extra.markup( profileMarkup(i18n)))
);

for (let key in router.profile) {
	profile.hears( match(router.profile[key]), enter(`${router.profile[key]}`));
}

profile.hears(match('back'), enter('start'));

module.exports = profile;