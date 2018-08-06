const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const { enter, leave } = Stage;
const { match } = require('telegraf-i18n');

const database = require('../bot.db').users;
const router = require('../bot.router');

const stock = new Scene('stock');

stock.enter( async ({ i18n, scene, reply, message: { from : { id } } }) => {
  let user, text;
  
  text = i18n.t('sellOilText');

  user = await database.once('value').then((snapshot) => snapshot.child(id).val());

  text += i18n.t('sellOilParametr', {
    oilBarrels: user.storage.oilBarrels,
    rate: 1000,
    limit: 3000
  });

	return reply(
    text,
    Extra.HTML()
	);
});

stock.on('message', async ({ i18n, session, scene, reply, message: { text, from : { id } } }, next) => {  
  const regExp = new RegExp('^[0-9]+$');
  if (!regExp.test(+text)) {
    return next();
  }

  const user = await database.once('value').then((snapshot) => snapshot.child(id).val());

  if (+text < 3000 || user.storage.oilBarrels < text ) {
    return reply(i18n.t('sellOilLimitError'), {
      limit: 3000
    });
  }

  const gold = ( text/1000 ).toFixed(1);

  await database.child(`${id}/storage`).update({ oilBarrels: user.storage.oilBarrels - text });
  await database.child(`${id}/currencies/gold`).update({
    amount: user.currencies.gold + Math.round( gold/100 * 70 )
  });
  await database.child(`${id}/currencies/out`).update({
    amount: user.currencies.out + Math.round( gold/100 * 30 )
  });

  return reply(i18n.t('sellOilSuccess', {
    oilBarrels: text,
    gold: gold
  }));
});

for (let key in router.start) {
	stock.hears( match(router.start[key]), enter(`${router.start[key]}`));
}

module.exports = stock;