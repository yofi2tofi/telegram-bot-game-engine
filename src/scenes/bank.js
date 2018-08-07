const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const { enter, leave } = Stage;
const { match } = require('telegraf-i18n');

const database = require('../bot.db').users;
const transactions = require('../bot.db').transactions;

const payments = require('../bot.payments');
const router = require('../bot.router');

const transaction = require('../models/transaction.model');

const bank = new Scene('bank');

const cryptoCur = {
  BTC: 'bitcoin',
  LTC: 'litecoin'
}

bank.enter( async ({ i18n, scene, reply, message: { from : { id } } }) => {
  let user, text;
  
  user = await database.once('value').then((snapshot) => snapshot.child(id).val());

  text = i18n.t('bankText', {
    gold: user.currencies.gold.amount,
    out: user.currencies.out.amount
  });

	return reply(
		text,
		Extra.HTML().markup((m) =>
	    m.inlineKeyboard([
        [ m.callbackButton(i18n.t('topUpTheBalance'), 'topUpTheBalance') ],
        [ m.callbackButton(i18n.t('withdraw'), 'withdraw') ],
        [ m.callbackButton(i18n.t('contribution'), 'contribution') ]
	    ]))
	);
});

bank.action('topUpTheBalance', async ({ i18n, reply, answerCbQuery, update: { callback_query: { from: { id }, data: data }} }) => {
  for (const key in cryptoCur) {
    reply(
			i18n.t(key),
			Extra.HTML().markup((m) =>
		    m.inlineKeyboard([
		      [ m.callbackButton(cryptoCur[key], `topUpTheBalance${key}`) ]
		    ])) 
		)
  }
  return;
});

for (const key in cryptoCur) {
  bank.action(`topUpTheBalance${key}`, async ({ i18n, reply, answerCbQuery, update: { callback_query: { from: { id }, data: data }} }) => {
    const option = {
      currency1: 'USD',
      currency2: key,
      amount: 1
    };

    let result = {};

    await new Promise((resolve, reject) => {
      payments.createTransaction(option, async (err, res) => {
        if (err) {
          reject();
        }
        result = res;
        res.userId = id;
        await transactions.push( new transaction(res) );
        resolve();
      });
    });

    return reply(i18n.t('topUpTheBalanceCurrencies', {
      cur: key,
      address: result.address
    }))
  });
}

for (let key in router.start) {
	bank.hears( match(router.start[key]), enter(`${router.start[key]}`));
}

module.exports = bank;