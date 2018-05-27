const Currencies = require('./currencies.model');
const { LevelOne, LevelTwo, LevelThree, LevelFour, LevelFive, LevelSix } = require('./oilPumps.model');
const Storage = require('./storage.model');

class InitModelClass {
	constructor() {
		this.currencies = new Currencies();
		this.oilPumps = [new LevelOne(), new LevelTwo(), new LevelThree(), new LevelFour(), new LevelFive(), new LevelSix() ];
		this.storage = new Storage();
		this.label = '';
		this.isLearned = false;
		this.level = 0;
	}
}

module.exports = InitModelClass;