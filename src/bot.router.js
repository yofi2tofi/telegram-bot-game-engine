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
		'Статистика': 'statistics',
		'Задания': 'task',
		'Рефераллы': 'referrals'
	},
	bank: {
		'Пополнить баланс': 'topUpTheBalance',
		'Вывести баланс': 'withdraw',
		'Сделать вклад': 'contibution'
	},
	market: {
		'Акции': 'stocks',
		'Акции PRO': 'stockPro',
		'Мои акции': 'myStocks',
		'Мой акционер': 'shareholder',
		'Поиск компаний': 'searchCompany'
	},
	stock: {
		'Продать нефть': 'sellOil'
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