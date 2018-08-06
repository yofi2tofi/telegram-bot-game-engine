class OilCoinModelClass {
	constructor() {
		this.id = 1;
		this.name = 'oilCoin';
		this.amount = 0;
	}
}

class GoldModelClass {
	constructor() {
		this.id = 3;
		this.name = '💰 Gold';
		this.amount = 0;
	}
}

class GoldToOutModelClass {
	constructor() {
		this.id = 3;
		this.name = '💰 Gold';
		this.amount = 0;
	}
}

class CurrenciesModelClass {
	constructor() {
		this.oilCoin = new OilCoinModelClass();
		this.gold = new GoldModelClass();
		this.out = new GoldToOutModelClass();
	}
}

module.exports = CurrenciesModelClass;