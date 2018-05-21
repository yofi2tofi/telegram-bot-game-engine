const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const { enter, leave } = Stage;

const profileMarkup = require('../markups/profile.markup');
const router = require('../bot.router');

const profile = new Scene('profile');

profile.enter( ({ reply }) => reply( 'Custom buttons keyboard for profile page', Extra.markup( profileMarkup ) ) );

for (let key in router.profile) {
	const regExp = new RegExp(key, 'ig');
	profile.hears( regExp , enter(`${router.profile[key]}`));
}

profile.hears(/Назад/gi, enter('start'));

module.exports = profile;