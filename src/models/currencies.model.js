class OilCoinModelClass {
	constructor() {
		this.id = 1;
		this.name = 'oilCoin';
		this.amount = 0;
	}
}

class ECoinModelClass {
	constructor() {
		this.id = 2;
		this.name = 'ECoin';
		this.amount = 0;
	}
}

class GoldModelClass {
	constructor() {
		this.id = 3;
		this.name = 'gold';
		this.amount = 0;
	}
}

class ECryptModelClass {
	constructor() {
		this.id = 4;
		this.name = 'eCrypt';
		this.amount = 0;
	}
}

class BlueBallModelClass {
	constructor() {
		this.id = 5;
		this.name = 'blueBall';
		this.amount = 0;
	}
}

class OrangeBallModelClass {
	constructor() {
		this.id = 6;
		this.name = 'orangeBall';
		this.amount = 0;
	}
}

class CurrenciesModelClass {
	constructor() {
		this.oilCoin = new OilCoinModelClass();
		this.eCoin = new ECoinModelClass();
		this.gold = new GoldModelClass();
		this.eCrypt = new ECryptModelClass();
		this.blueBall = new BlueBallModelClass();
		this.orangeBall = new OrangeBallModelClass();
	}
}

module.exports = CurrenciesModelClass;