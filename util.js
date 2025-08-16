// utils.js
const fs = require('fs');
const path = require('path');

let startTime = Date.now();

const spam_count = {};
const temp_blacklist = new Map();
const spam_offenses = {};
const whitelist = ['Damix2131', 'q33a', 'ryk_cbaool',
    'Abottomlesspit', 'MioAutoCrystal', 'NIKASTEIN', "xiNxghtMar3ix"];

async function updateUserLifetimeStats(username, state) {
  try {
    const stats = await fetchLifetimeStats(username);
    state.totalStats[username] = stats;
    return stats;
  } catch (err) {
    console.error(`[Utils] Failed to fetch lifetime stats for ${username}:`, err);
    return null;
  }
}

function loadBotData(state) {
  try {
    const inputPath = path.join(__dirname, 'output', 'bot_data.json');
    if (fs.existsSync(inputPath)) {
      const jsonData = fs.readFileSync(inputPath, 'utf8');
      const data = JSON.parse(jsonData);

      state.quotes = data.quotes || {};
      state.crystalled = data.kills || 0;
      state.crystal_deaths = data.crystal_deaths || {};
      state.crystal_kills = data.crystal_kills || {};
      state.global_deaths = data.deaths || 0;
      state.topKills = data.topKills || {};
      state.marriages = data.marriages || {};
      state.bot_uses = data.bot_uses || {};
      state.totalStats = data.totalStats || {};
      state.sessions = data.sessions || {}

      console.log('[Bot] Loaded bot_data.json');
    } else {
      console.log('[Bot] No bot_data.json found, starting fresh');
    }
  } catch (err) {
    console.error('[Bot] Failed to load bot_data.json:', err);
  }
}

function saveBotData(state) {
  try {
    const data = {
      quotes: state.quotes || {},
      totalStats: state.totalStats || {},
      crystal_kills: state.crystal_kills || {},
      crystal_victims: state.crystal_victims || {},
      kills: state.crystalled || 0, 
      deaths: state.global_deaths,
      topKills: state.crystal_kills || {},
      marriages: state.marriages || {},
      bot_uses: state.bot_uses || 0,
      sessions: state.sessions || {},
      lastUpdate: new Date().toISOString()
      
    };

    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const filePath = path.join(outputDir, 'bot_data.json');
    //console.log('[Bot] About to save bot data');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log(`[Bot] Saved Data!`);
    //console.log(`[Bot] outputDir ${outputDir}`)
    //console.log('[Bot] __dirname is:', __dirname);
  } catch (err) {
    console.error('[Bot] Error saving bot_data.json:', err);
  }
}


function startAutoSave(state, intervalMs = 2 * 60 * 1000) {
  setInterval(() => saveBotData(state), intervalMs);

  process.on('SIGINT', () => {
    saveBotData(state);
    process.exit();
  });
  process.on('SIGTERM', () => {
    saveBotData(state);
    process.exit();
  });
}

function get_uptime() {
  const now = Date.now();
  const uptime = now - startTime;

  const totalSeconds = Math.floor(uptime / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
}

function random_element(arr) {
  return String(arr[Math.floor(Math.random() * arr.length)]);
}

function createRandomString(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function safeChat(msg) {
  return `${msg} ${createRandomString((Math.floor(Math.random() * 5))+5)}`
}

function get_random_ip() {
  const array = [];
  for (let i = 0; i < 4; i++) {
    array.push(Math.floor(Math.random() * 256));
  }
  const [a, b, c, d] = array;
  return `${a}.${b}.${c}.${d}`;
}

function getIndefiniteArticle(word) {
  if (!word) return '';
  return /^[aeiou]/i.test(word) ? 'an' : 'a';
}

/**
 * General handler for "percent" style commands
 * Example output: "player is 73% gay"
 * options:
 * - status: fixed string status to output instead of percent
 * - customMessage: a function (user, cmd) => string for full custom message
 * - isRating: if true, percent is 1-10 instead of 0-100
 * - useArticle: add indefinite article ("a" or "an") before command name
 */
function handlePercentCmd(user, prefix, message, bot, state, options = {}) {
  const [fullCmd, ...rest] = message.trim().split(/\s+/);
  const cmd = fullCmd.replace(prefix, '').toLowerCase();
  let args = rest.join(' ');

  if (!args || args.trim() === '') args = user;

  if (args.toLowerCase() === 'random') {
    const players = Object.keys(bot.players);
    if (players.length > 0) {
      args = state.random_element(players);
    } else {
      args = user;
    }
  }

  if (options.status) {
    return state.safeChat(`${args} is ${options.status}`);
  }

  if (options.customMessage) {
    return state.safeChat(options.customMessage(args, cmd));
  }

  let value = Math.floor(Math.random() * 101);
  if (options.isRating) {
    value = Math.floor(Math.random() * 10) + 1;
  }

  let article = '';
  if (options.useArticle) {
    article = getIndefiniteArticle(cmd) + ' ';
  }

  return state.safeChat(`${args} is ${article}${value}% ${cmd}`);
}

function handleTargetCommand(user, prefix, message, bot, state, label, usage, chatMessageFn) {
  let args = message.split(`${prefix}${label} `)[1];

  if (args && args.toLowerCase() === 'random') {
    const players = Object.keys(bot.players);
    args = state.random_element(players);
  }

  if (!args || args.trim().length === 0) {
    return bot.chat(state.safeChat(`Usage: ${prefix}${label} ${usage}`));
  }

  const msg = chatMessageFn(user, args);
  return bot.chat(state.safeChat(msg));
}

function get_kd(target, state) {
  const hasKills = state.crystal_kills.hasOwnProperty(target);
  const hasDeaths = state.crystal_deaths.hasOwnProperty(target);

  if (hasKills || hasDeaths) {
    const kills = state.crystal_kills[target] || 0;
    const deaths = state.crystal_deaths[target] || 0;
    const kd = deaths === 0 ? kills : (kills / deaths).toFixed(2);

    return `${target} has ${kills} kill${kills !== 1 ? 's' : ''} and ${deaths} death${deaths !== 1 ? 's' : ''}. KD: ${kd}`
  } else {
    return `Player ${target} has no recorded kills or deaths.`
  }
}

function return_user(msg) {
  let no_rank_message = '';
  let get_username = '';

  if (msg.startsWith('[')) {
    no_rank_message = msg.split(']')[1];
    get_username = no_rank_message.split('»')[0];
  } else if (msg.includes('whispers')) {
    get_username = msg.split('whispers')[0];
  } else {
    get_username = msg.split('»')[0];
  }

  return get_username?.trim() || '';
}

function whitelisted_users(user) {
  return whitelist.includes(user.trim());
}

function blacklist(bot, user) {
  if (temp_blacklist.has(user)) return;

  if (!spam_offenses[user]) spam_offenses[user] = 1;
  else spam_offenses[user]++;

  if (spam_offenses[user] >= 6) spam_offenses[user] = 6;

  const minutes = spam_offenses[user] * 5;
  const duration = minutes * 60 * 1000;

  temp_blacklist.set(user, true);
  bot.whisper(user, `Blacklisted for spamming (${minutes} minutes).`);

  setTimeout(() => {
    temp_blacklist.delete(user);
    bot.whisper(user, "You're no longer blacklisted.");
  }, duration);
}

function checkSpam(bot, user) {
  if (!spam_count[user]) {
    spam_count[user] = 1;
  } else {
    spam_count[user]++;
  }

  setTimeout(() => {
    if (spam_count[user]) {
      spam_count[user]--;
      if (spam_count[user] <= 0) delete spam_count[user];
    }
  }, 5000);

  if (spam_count[user] >= 5) {
    spam_count[user] = 0;
    blacklist(bot, user);
    return true;
  }
  return false;
}

module.exports = {
  get_uptime,
  random_element,
  get_random_ip,
  return_user,
  whitelisted_users,
  blacklist,
  checkSpam,
  get_kd,
  safeChat,
  handlePercentCmd,
  handleTargetCommand,
  saveBotData,
  startAutoSave,
  loadBotData,
  updateUserLifetimeStats,
  spam_count,
  temp_blacklist,
  spam_offenses,
  whitelist,

};
