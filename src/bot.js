const Telegraf  = require('telegraf');
const session = require('telegraf/session');
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

const bot = new Telegraf(env.BOT_TOKEN);

bot.use(firebaseSession(database));

/**
 * Создает сцены и добавляет их
 */
const stage = new Stage([], { ttl: 60000 * 60 * 24 })
scenes(stage);
bot.use(stage.middleware());

/**
 * Настраивает команды и слушателей по путям роутера
 */
commands(bot);
listens(bot);
actions(bot);

bot.startPolling();