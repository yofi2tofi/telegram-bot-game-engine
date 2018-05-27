const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const { enter, leave } = Stage;

const welcome = require('../texts/texts.json').welcome;
const text = require('../texts/learning.json');

const learning = new Scene('learning');

learning.enter( ({ reply }) => reply( 
	welcome,
	Extra.markup((markup) => markup.resize().keyboard(['🗞', '📰']) )
));

learning.hears('📰', enter('start'));

learning.hears('🗞', ( ({ reply }) => reply(
		text.one, 
		Extra.markup((markup) => markup.resize().keyboard(['🎓']) )
	) 
));

learning.hears('🎓', ( ({ reply }) => reply(
		text.two, 
		Extra.markup((markup) => markup.resize().keyboard(['📃']) )
	) 
));

learning.hears('📃', ( ({ reply }) => reply(
		text.three, 
		Extra.markup((markup) => markup.resize().keyboard(['📄']) )
	) 
));

learning.hears('📄', ( ({ reply }) => reply(
		text.four, 
		Extra.markup((markup) => markup.resize().keyboard(['🗒']) )
	) 
));

learning.hears('🗒', ( ({ reply }) => reply(
		text.five, 
		Extra.markup((markup) => markup.resize().keyboard(['🏁']) )
	) 
));

learning.hears('🏁', ( ({ scene }) => scene.enter('start') ));

module.exports = learning;