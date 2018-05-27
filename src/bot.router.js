const router = {
	start: {
		'Моя компания': 'profile',
		'Банк': 'bank',
		'Рынок': 'market',
		'Биржа': 'stock',
		'Игры': 'games',
		'Дополнительно': 'more'
	},
	profile: {
		'Нефтянные насосы': 'oilPump',
		'Электростанции': 'powerPlant',
		'Статистика': 'statistics',
		'Задания': 'task',
		'Рефераллы': 'referrals'
	},
	bank: {
		'Пополнить баланс': 'topUpTheBalance',
		'Обмен валюты': 'currencyExchange',
		'Вывести баланс': 'withdraw'
	},
	market: {
		'Акции': 'stocks',
		'Акции PRO': 'stockPro',
		'Мои акции': 'myStocks',
		'Мой акционер': 'shareholder',
		'Поиск компаний': 'searchCompany'
	},
	stock: {
		'Продать нефть': 'sellOil',
		'Продать энергию': 'sellEnergy'
	},
	games: {
		'Получить бонус': 'dailyBonus'
	},
	more: {
		'Название': 'label',
		'Настройки': 'settings',
		'Выплаты': 'payments',
		'Сообщество': 'community',
		'Помощь': 'notifications'
	}
}

module.exports = router;