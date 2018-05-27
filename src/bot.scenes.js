const Stage = require('telegraf/stage');

const task = require('./scenes/task');
const start = require('./scenes/start');
const profile = require('./scenes/profile');
const oilpump = require('./scenes/oilpump');
const learning = require('./scenes/learning');

module.exports = (stage) => {
	stage.register(task);
	stage.register(start);
	stage.register(profile);
	stage.register(oilpump);
	stage.register(learning);
}