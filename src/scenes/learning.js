const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const { enter, leave } = Stage;

const welcome = require('../texts/texts.json').welcome;
const text = require('../texts/learning.json');

const learning = new Scene('learning');

learning.enter( ({ i18n, reply }) => reply( 
	i18n.t('welcome'),
	Extra.markup((markup) => markup.resize().keyboard(['🗞', '📰']) )
));

learning.hears('📰', enter('start'));

learning.hears('🗞', ( ({ i18n, reply }) => reply(
		i18n.t('learnStepOne'),
		Extra.markup((markup) => markup.resize().keyboard(['🎓']) )
	) 
));

learning.hears('🎓', ( ({ i18n, reply }) => reply(
		i18n.t('learnStepTwo'),
		Extra.markup((markup) => markup.resize().keyboard(['📃']) )
	) 
));

learning.hears('📃', ( ({ i18n, reply }) => reply(
		i18n.t('learnStepThree'),
		Extra.markup((markup) => markup.resize().keyboard(['📄']) )
	) 
));

learning.hears('📄', ( ({ i18n, reply }) => reply(
		i18n.t('learnStepFour'),
		Extra.markup((markup) => markup.resize().keyboard(['🗒']) )
	) 
));

learning.hears('🗒', ( ({ i18n, reply }) => reply(
		i18n.t('learnStepFive'),
		Extra.markup((markup) => markup.resize().keyboard(['🏁']) )
	) 
));

learning.hears('🏁', ( ({ scene }) => scene.enter('start') ));

module.exports = learning;