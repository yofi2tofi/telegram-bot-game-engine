const randomBytes = require('crypto').randomBytes;
const createHmac = require('crypto').createHmac;

const Currencies = require('./currencies.model');
const { LevelOne, LevelTwo, LevelThree, LevelFour, LevelFive, LevelSix } = require('./oilPumps.model');
const Storage = require('./storage.model');

const generateHashed = (id) => {
  return createHmac('sha256', randomBytes(128).toString('base64')).update(id.toString()).digest('hex');
};

class InitModelClass {
	constructor(id) {
		this.currencies = new Currencies();

		this.oilPumps = [new LevelOne(), new LevelTwo(), new LevelThree(), new LevelFour(), new LevelFive(), new LevelSix() ];
		this.energyPumps = [];

		this.storage = new Storage();
		this.label = '';
		
		this.level = 0;
		this.system = {
			isLearned: false,
			refferer: null,
			refferals: [],
			refUrl: generateHashed(id),
			stocks: 50
		};

		this.tasks = 0;

		this.created = new Date().getTime();
	}
}

module.exports = InitModelClass;