const Stage = require('telegraf/stage');

const agreement = require('./scenes/agreement');
const language = require('./scenes/language');

// Start
const start = require('./scenes/start');
const profile = require('./scenes/profile');

// Profile
const task = require('./scenes/task');
const oilpump = require('./scenes/oilpump');
const learning = require('./scenes/learning');
const statistics = require('./scenes/statistics');
const referrals = require('./scenes/referrals');

// Market
const stock = require('./scenes/stock');

module.exports = (stage) => {
	stage.register(task);
	stage.register(start);
	stage.register(profile);
	stage.register(oilpump);
	stage.register(learning);
	stage.register(statistics);
	stage.register(referrals);
	stage.register(agreement);
	stage.register(language);

	stage.register(stock);
}