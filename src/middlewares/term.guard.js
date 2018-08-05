const Stage = require('telegraf/stage');
const { enter, leave } = Stage;

const database = require('../bot.db').users;

const START = '/start';

const termGuard = () => {
  return async (ctx, next) => {
    const { i18n, reply, scene, message: { text, from: { id } }} = ctx;
    const user = await database.once('value').then((snapshot) => snapshot.child(id).val());
    if (text === START) {
      return next();
    }
    if (!user.system.isTerm) {
      return reply(i18n.t('forbidden'));
    }
    return next();
  }
};

module.exports = termGuard;