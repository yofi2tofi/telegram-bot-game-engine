class LevelOneClass {
	constructor() {
		this.id = 1;
		this.point = 0;
		this.countPumps = 0;
		this.price = 100;
		this.gain = 16;
		this.lastHarvest = 0;
		this.currency = '💰 Gold';
		this.name = '⛽️1️⃣ Деревянный ручной насос';
	}
}

class LevelTwoClass {
	constructor() {
		this.id = 2;
		this.point = 0;
		this.countPumps = 0;
		this.price = 1000;
		this.gain = 184;
		this.lastHarvest = 0;
		this.currency = '💰 Gold';
		this.name = '⛽️2️⃣ Металлический насос';
	}
}

class LevelThreeClass {
	constructor() {
		this.id = 3;
		this.point = 0;
		this.countPumps = 0;
		this.price = 6000;
		this.gain = 1249;
		this.lastHarvest = 0;
		this.currency = '💰 Gold';
		this.name = '⛽️3️⃣ Фабричный  насос';
	}
}

class LevelFourClass {
	constructor() {
		this.id = 4;
		this.point = 0;
		this.countPumps = 0;
		this.price = 18000;
		this.gain = 4463;
		this.lastHarvest = 0;
		this.currency = '💰 Gold';
		this.name = '⛽️4️⃣ Профессиональный насос';
	}
}

class LevelFiveClass {
	constructor() {
		this.id = 5;
		this.point = 0;
		this.countPumps = 0;
		this.price = 45000;
		this.gain = 13020;
		this.lastHarvest = 0;
		this.currency = '💰 Gold';
		this.name ='⛽️5️⃣ Насос с ионным двигателем';
	}
}

class LevelSixClass {
	constructor() {
		this.id = 6;
		this.point = 0;
		this.countPumps = 0;
		this.price = 90000;
		this.gain = 31250;
		this.lastHarvest = 0;
		this.currency = '💰 Gold';
		this.name ='⛽️6️⃣ Насос на квантовой тяге';
	}
}

module.exports = {
	LevelOne: LevelOneClass,
	LevelTwo: LevelTwoClass,
	LevelThree: LevelThreeClass,
	LevelFour: LevelFourClass,
	LevelFive: LevelFiveClass,
	LevelSix: LevelSixClass
};