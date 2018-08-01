const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const { enter, leave } = Stage;
const { match } = require('telegraf-i18n');

const texts = require('../texts/texts.json');

const profileMarkup = require('../markups/profile.markup');
const router = require('../bot.router');
const database = require('../bot.db').users;

const oilPump = new Scene('oilPump');

oilPump.enter( async ({ i18n, scene, reply, message: { from : { id } } }) => {
	let user, text;

	text = i18n.t('oilText');

	await database.once('value').then((snapshot) => user = snapshot.child(id).val() );

	user.oilPumps.forEach( ({ name, countPumps, point, lastHarvest }) => {
		let extractBarrels = getTotalHarvest(countPumps, point, lastHarvest);

		text += i18n.t('oilPumpStatistics', {
			name: name,
			countPumps: countPumps,
			extractBarrels: extractBarrels
		});
	});

	text += i18n.t('oilPumpStorage', {
		oilBarrels: user.storage.oilBarrels
	});

	// TODO: Добавить информацию о 30% которые уходят для держателя акций

	return reply( 
		text,
		Extra.HTML().markup((m) =>
	    m.inlineKeyboard([
	      [ m.callbackButton(i18n.t('boyOilPumps'), 'buyOilPumps') ],
	      [ m.callbackButton(i18n.t('sendOilToStorage'), 'sendOilToStorage') ]
	    ]))
	);
});

oilPump.action('buyOilPumps', async ({ i18n, reply, update: { callback_query: { from: { id }}} }) => {
	let user;

	await database.once('value').then((snapshot) => user = snapshot.child(id).val() );

	user.oilPumps.forEach( ({ name, price, gain, currency, id }) => {
		let text;

		text = i18n.t('gainOilPerHour', {
			name: name,
			gain: gain,
			price: price,
			currency: currency
		});

		reply(
			text,
			Extra.HTML().markup((m) =>
		    m.inlineKeyboard([
		      [ m.callbackButton(i18n.t('buy'), `buyOilPump::${id}`) ]
		    ])) 
		)
	});

	return;
});

oilPump.action(/buyOilPump/, async ({ i18n, answerCbQuery, update: { callback_query: { from: { id }, data: data }} }) => {
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

		return answerCbQuery(i18n.t('buySuccess', {
			name: name
		}), true);
	}

	function errorPurchaise() {
		return answerCbQuery(i18n.t('notEnoughMoney', {
			amount: price - user.currencies.oilCoin.amount,
			currency: currency
		}), true);
	}
});

oilPump.action('sendOilToStorage', async ({ i18n, answerCbQuery, update: { callback_query: { from: { id }, data: data }} }) => {
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

		return answerCbQuery(i18n.t('sendOilBarrelsToStorage', {
			oilBarrels
		}), true);
	});
});

for (let key in router.profile) {
	oilPump.hears( match(router.profile[key]) , enter(`${router.profile[key]}`));
}

oilPump.hears(match('back'), enter('start'));

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