const path = require('path')

const Telegraf  = require('telegraf');
const TelegrafI18n = require('telegraf-i18n')
const session = require('telegraf/session');
const rateLimit = require('telegraf-ratelimit')
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const { enter, leave } = Stage;

const firebaseSession = require('telegraf-session-firebase');

const env    = require('../environment/environment');
const scenes = require('./bot.scenes');
const commands = require('./bot.commands');
const listens = require('./bot.listens');
const actions = require('./bot.actions');
const database = require('./bot.db').sessions;

const i18n = new TelegrafI18n({
  defaultLanguage: 'ru',
  useSession: true,
  directory: path.resolve('locales')
})

// Set limit to 1 message per 3 seconds
const limitConfig = {
  window: 3000,
  limit: 1,
  onLimitExceeded: (ctx, next) => ctx.reply(ctx.i18n.t('Rate limit'))
}

const bot = new Telegraf(env.BOT_TOKEN);

bot.use(firebaseSession(database));
bot.use(i18n.middleware())
bot.use(rateLimit(limitConfig))

/**
 * Создает сцены и добавляет их
 */
const stage = new Stage([], { ttl: 60000 * 60 * 24 })
scenes(stage);
bot.use(stage.middleware());

/**
 * Настраивает команды и слушателей по путям роутера
 */
commands(bot, i18n);
listens(bot);
actions(bot);

bot.startPolling();