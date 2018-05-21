const Stage = require('telegraf/stage');
const { enter, leave } = Stage;

const start   = require('./scenes/start');
const profile = require('./scenes/profile');

module.exports = (stage) => {
	stage.register(start);
	stage.register(profile);
}