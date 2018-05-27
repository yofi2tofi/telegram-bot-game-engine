const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const { enter, leave } = Stage;

const texts = require('../texts/texts.json');

const profileMarkup = require('../markups/profile.markup');
const router = require('../bot.router');
const database = require('../bot.db').users;

const oilPump = new Scene('oilPump');

oilPump.enter( async ({ scene, reply, message: { from : { id } } }) => {
	let user, text;

	text = texts.oil;

	await database.once('value').then((snapshot) => user = snapshot.child(id).val() );

	user.oilPumps.forEach( ({ name, countPumps, point, lastHarvest }) => {
		let extractBarrels = getTotalHarvest(countPumps, point, lastHarvest);

		text += `${name}\nКоличество: ${countPumps}\nДобыто: ${extractBarrels} 🛢 баррелей нефти\n\n`;
	});

	text += `📦 Баррелей нефти на складе: ${user.storage.oilBarrels}`;

	// TODO: Добавить информацию о 30% которые уходят для держателя акций

	return reply( 
		text,
		Extra.HTML().markup((m) =>
	    m.inlineKeyboard([
	      [ m.callbackButton('Купить насосы', 'buyOilPumps') ],
	      [ m.callbackButton('Отправить ресурсы на склад', 'sendOilToStorage') ]
	    ])) 
	);
});

oilPump.action('buyOilPumps', async ({ reply, update: { callback_query: { from: { id }}} }) => {
	let user;

	await database.once('value').then((snapshot) => user = snapshot.child(id).val() );

	user.oilPumps.forEach( ({ name, price, gain, currency, id }) => {
		let text;

		text = `${name}\n\nДобывает ${gain} 🛢 баррелей нефти в час\nЦена: ${price} ${currency}`;

		reply(
			text,
			Extra.HTML().markup((m) =>
		    m.inlineKeyboard([
		      [ m.callbackButton('Купить', `buyOilPump::${id}`) ]
		    ])) 
		)
	});

	return;
});

oilPump.action(/buyOilPump/, async ({ answerCbQuery, update: { callback_query: { from: { id }, data: data }} }) => {
	let user, oilPump,
			oilPumpId = Math.abs(data.split('::')[1]);

	await database.once('value').then((snapshot) => user = snapshot.child(id).val() );

	let { name, countPumps, price, point, gain, currency } = user.oilPumps[oilPumpId - 1];

	if ( user.currencies.oilCoin.amount >= price )
		return successPurchaise();
	else if ( user.currencies.oilCoin.amount < price )
		return errorPurchaise();

	async function successPurchaise() {
		let difference = user.currencies.oilCoin.amount - price;
		let updateOilPumps = {
			countPumps: countPumps += 1,
			lastHarvest: new Date().getTime(),
			point: point += gain
		};

		await database.child(`${id}/currencies/oilCoin`).update({ amount: difference });
		await database.child(`${id}/oilPumps/${oilPumpId - 1}`).update(updateOilPumps);

		return answerCbQuery(`${name}\n\nУспешно купленно`, true);
	}

	function errorPurchaise() {
		return answerCbQuery(`У Вас недостаточно средств\nВам не хватает ${price - user.currencies.oilCoin.amount} ${currency}`, true);
	}
});

oilPump.action('sendOilToStorage', async ({ answerCbQuery, update: { callback_query: { from: { id }, data: data }} }) => {
	let user, text, 
			oilBarrels = 0;

	await database.once('value').then((snapshot) => user = snapshot.child(id).val() );

	let promise = new Promise((resolve) => {

		user.oilPumps.forEach( async ({ countPumps, point, lastHarvest }, index) => {
			let extractBarrels = getTotalHarvest(countPumps, point, lastHarvest);

			await database.child(`${id}/oilPumps/${index}`).update({ lastHarvest: new Date().getTime() });

			oilBarrels += extractBarrels;

			if ( index === user.oilPumps.length - 1)
				resolve()
		});
	});

	promise.then( async () => {
		await database.child(`${id}/storage`).update({ oilBarrels: user.storage.oilBarrels + oilBarrels });

		return answerCbQuery(`${oilBarrels} баррелей отправленно на склад`, true);
	});
});

for (let key in router.profile) {
	const regExp = new RegExp(key, 'ig');
	oilPump.hears( regExp , enter(`${router.profile[key]}`));
}

oilPump.hears(/Назад/gi, enter('start'));

module.exports = oilPump;

function getTotalHarvest(countPumps, point, lastHarvest) {
	let now = new Date().getTime(),
			pointPerMinute = point / 60,
			extractBarrels,
			difference;

	if ( countPumps === 0 )
		extractBarrels = 0;

	if ( countPumps > 0 ) {
		difference = Math.round( ( now - lastHarvest ) / ( 1000 * 60 ) );
		extractBarrels = Math.round( difference * pointPerMinute );
	}

	return extractBarrels;
}