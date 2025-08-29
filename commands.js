const { safeChat } = require("./util");
require('dotenv').config();
const superusers = process.env.SUPERUSER ? process.env.SUPERUSER.split(',').map(u => u.trim()).filter(Boolean): [];

// --- Add getArgs utility function ---
function getArgs(message, prefix, command) {
    // Remove prefix and command from the message, then split by spaces
    const cmdPattern = new RegExp(`^${prefix}${command}\\s*`, 'i');
    const argsString = message.replace(cmdPattern, '').trim();
    return argsString.length ? argsString.split(/\s+/) : [];
}

// commands.js
const prefix = "-";

const public_commands = {
    [`${prefix}help`]: (user, message, bot, state) => {
        const isAdmin = state.whitelisted_users(user);
        let args = message.trim().split(/\s+/);

        const isAdminMode = args[1] === "admin" && isAdmin;
        const pageArg = isAdminMode ? args[2] : args[1];
        const page = parseInt(pageArg) || 1;

        const commandSource = isAdminMode ? admin_commands : public_commands;
        const commandList = Object.keys(commandSource);

        const maxPerPage = 8;
        const totalPages = Math.ceil(commandList.length / maxPerPage);

        if (page < 1 || page > totalPages) {
            return bot.chat(state.safeChat(`Invalid page. (${page}/${totalPages})`));
        }

        const startIndex = (page - 1) * maxPerPage;
        const paginated = commandList.slice(startIndex, startIndex + maxPerPage);
        const modeText = isAdminMode ? "Admin" : "Public";

        bot.chat(state.safeChat(`${modeText} Commands - Page ${page}/${totalPages}: ${paginated.join(" ")}`));
    },

    [`${prefix}topkills`]: (user, message, bot, state) => {
        const entries = Object.entries(state.crystal_kills);
        if (entries.length === 0) {
            bot.chat(state.safeChat(`Amount of people crystalled since join: ${state.crystalled}`))
        } else {
            const [topUser, topKills] = entries.sort((a, b) => b[1] - a[1])[0];
            bot.chat(state.safeChat(`Amount of people crystalled since join: ${state.crystalled}, Most kills has: ${topUser} with ${topKills} kills`));
        }
    },

    [`${prefix}uptime`]: (user, message, bot, state) => bot.chat(state.safeChat(`Uptime: ${state.get_uptime()}`)),
    [`${prefix}deaths`]: (user, message, bot, state) => bot.chat(state.safeChat(`Bot ${state.deaths}, Global: ${state.global_deaths}`)),
    [`${prefix}health`]: (user, message, bot, state) => bot.chat(state.safeChat(`Bot has ${bot.health.toFixed(1)} hearts`)),

    [`${prefix}rape`]: (user, message, bot, state) =>
        state.handleTargetCommand(user, prefix, message, bot, state, 'rape', '<username>', (user, target) => `${user} rapes ${target}`),

    [`${prefix}kys`]: (user, message, bot, state) =>
        state.handleTargetCommand(user, prefix, message, bot, state, 'kys', '<username>', (user, target) => `Go kill yourself ${target}`),

    [`${prefix}pp`]: (user, message, bot, state) =>
        state.handleTargetCommand(user, prefix, message, bot, state, 'pp', '<username>', (user, target) => {
            const size = "=".repeat(Math.floor(Math.random() * 50));
            return `${target}'s dick: 8${size}D`;
        }),

    [`${prefix}iq`]: (user, message, bot, state) =>
        state.handleTargetCommand(user, prefix, message, bot, state, 'iq', '<username>', (user, target) => {
            const iq = Math.floor(Math.random() * 160) + 40;
            return `${target}'s IQ is ${iq}`;
        }),

    [`${prefix}jew`]: (user, message, bot, state) => bot.chat(state.handlePercentCmd(user, prefix, message, bot, state)),
    [`${prefix}indian`]: (user, message, bot, state) => bot.chat(state.handlePercentCmd(user, prefix, message, bot, state)),
    [`${prefix}gay`]: (user, message, bot, state) => bot.chat(state.handlePercentCmd(user, prefix, message, bot, state)),
    [`${prefix}furry`]: (user, message, bot, state) => bot.chat(state.handlePercentCmd(user, prefix, message, bot, state)),
    [`${prefix}trans`]: (user, message, bot, state) => bot.chat(state.handlePercentCmd(user, prefix, message, bot, state)),
    [`${prefix}retard`]: (user, message, bot, state) => bot.chat(state.handlePercentCmd(user, prefix, message, bot, state)),
    [`${prefix}femboy`]: (user, message, bot, state) => bot.chat(state.handlePercentCmd(user, prefix, message, bot, state)),
    [`${prefix}nigger`]: (user, message, bot, state) => bot.chat(state.handlePercentCmd(user, prefix, message, bot, state)),

    // Uncomment and complete if needed
    // [`${prefix}kit`]: (user, message, bot, state) => {
    //   let args = message.split(`${prefix}kit `)[1];

    //   if (args && args.trim().length > 0) {
    //     if (kits.includes(args)) {
    //       bot.chat(state.safeChat(`${user} has received kit ${args}`)
    //     } else if (args.toLowerCase() === 'help') {
    //       bot.chat(state.safeChat(`Avaiable kits: ${kits.join(', ')}`)
    //     } else {
    //       bot.chat(state.safeChat(`Invalid Kit!, Use: ${kits.join(', ')}`)
    //     }
    //   } else {
    //     bot.chat(state.safeChat(`Please pick an Kit you want to use with ${prefix}kit help`)
    //   }
    // },
    
    [`${prefix}lesbian`]: (user, message, bot, state) => {
        bot.chat(state.handlePercentCmd(user, prefix, message, bot, state))
    },

    [`${prefix}turkish`]: (user, message, bot, state) => {
        bot.chat(state.handlePercentCmd(user, prefix, message, bot, state))
    },

    [`${prefix}simp`]: (user, message, bot, state) => {
        bot.chat(state.handlePercentCmd(user, prefix, message, bot, state))
    },

    [`${prefix}based`]: (user, message, bot, state) => {
        const args = getArgs(message, prefix, "based");
        let target = args[0];
        const status = Math.random() < 0.5 ? 'BASED' : 'Cringe';
        if (target === 'random') {
            const players = Object.keys(bot.players);
            target = state.random_element(players);
        } else if (target === '|') {
            target = user;
        }
        if (target && target.trim().length > 0) {
            bot.chat(state.safeChat(`${target} is ${status}`));
        } else {
            bot.chat(state.safeChat(`${user} is ${status}`));
        }
    },

    [`${prefix}edge`]: (user, message, bot, state) => {
        const args = getArgs(message, prefix, "edge");
        let target = args[0];
        const response = Math.floor(Math.random() * 356);
        if (target === 'random') {
            const players = Object.keys(bot.players);
            target = state.random_element(players);
        } else if (target === '|') {
            target = user;
        }
        if (target && target.trim().length > 0) {
            bot.chat(state.safeChat(`${target} has an edging streak of ${response} days`));
        } else {
            bot.chat(state.safeChat(`${user} has an edging streak of ${response} days`));
        }
    },

    [`${prefix}love`]: (user, message, bot, state) => {
        const args = getArgs(message, prefix, "love");
        if (args.length < 2) {
            return bot.chat(state.safeChat(`Usage: ${prefix}love <user1> <user2>`));
        }
        const [user1, user2] = args;
        const percent = Math.floor(Math.random() * 101);
        bot.chat(state.safeChat(`${user1} <3 ${user2} = ${percent}% match`));
    },

    [`${prefix}rate`]: (user, message, bot, state) => {
        const args = getArgs(message, prefix, "rate");
        let target = args[0];
        const rating = Math.floor(Math.random() * 10) + 1;
        if (target === 'random') {
            const players = Object.keys(bot.players);
            target = state.random_element(players);
        } else if (target === '|') {
            target = user;
        }
        if (target && target.trim().length > 0) {
            bot.chat(state.safeChat(`${target} is a ${rating}/10`));
        } else {
            bot.chat(state.safeChat(`${user} is a ${rating}/10`));
        }
    },

    [`${prefix}stfu`]: (user, message, bot, state) => {
        const args = getArgs(message, prefix, "stfu");
        let target = args[0];
        if (target === 'random') {
            const players = Object.keys(bot.players);
            target = state.random_element(players);
        } else if (target === '|') {
            target = user;
        } else if (!bot.players[target])
            return;

        if (target && target.trim().length > 0) {
            bot.chat(state.safeChat(`Shut the fuck up ${target}`));
        } else {
            bot.chat(state.safeChat(`Usage: ${prefix}stfu <username>`));
        }
    },

    [`${prefix}racist`]: (user, message, bot, state) => {
        const args = getArgs(message, prefix, "racist");
        let target = args[0];
        const percent = Math.floor(Math.random() * 101);
        if (target === 'random') {
            const players = Object.keys(bot.players);
            target = state.random_element(players);
        } else if (target === '|') {
            target = user;
        }
        if (target && target.trim().length > 0) {
            bot.chat(state.safeChat(`${target} is ${percent}% racist`));
        } else {
            bot.chat(state.safeChat(`${user} is ${percent}% racist`));
        }
    },

    [`${prefix}insult`]: (user, message, bot, state) => {
        const args = getArgs(message, prefix, "insult");
        let target = args[0];
        const insult = state.random_element(state.insults);
        if (target === 'random') {
            const players = Object.keys(bot.players);
            target = state.random_element(players);
        } else if (target === '|') {
            target = user;
        }
        if (target && target.trim().length > 0) {
            bot.chat(state.safeChat(`${target} ${insult}`));
        } else {
            bot.chat(state.safeChat(`${user} ${insult}`));
        }
    },

    [`${prefix}mental`]: (user, message, bot, state) => {
        const args = getArgs(message, prefix, "mental");
        let target = args[0];
        const result = state.random_element(state.illnesses);
        if (target === 'random') {
            const players = Object.keys(bot.players);
            target = state.random_element(players);
        } else if (target === '|') {
            target = user;
        }
        if (target && target.trim().length > 0) {
            bot.chat(state.safeChat(`${target} diagnosed with ${result}`));
        } else {
            bot.chat(state.safeChat(`${user} diagnosed with ${result}`));
        }
    },

    [`${prefix}cringe`]: (user, message, bot, state) =>
        bot.chat(state.handlePercentCmd(user, prefix, message, bot, state)),

    [`${prefix}swedish`]: (user, message, bot, state) =>
        bot.chat(state.handlePercentCmd(user, prefix, message, bot, state)),

    [`${prefix}european`]: (user, message, bot, state) =>
        bot.chat(state.handlePercentCmd(user, prefix, message, bot, state)),

    [`${prefix}white`]: (user, message, bot, state) =>
        bot.chat(state.handlePercentCmd(user, prefix, message, bot, state)),

    [`${prefix}aryan`]: (user, message, bot, state) =>
        bot.chat(state.handlePercentCmd(user, prefix, message, bot, state)),

    [`${prefix}nazi`]: (user, message, bot, state) =>
        bot.chat(state.handlePercentCmd(user, prefix, message, bot, state)),

    [`${prefix}gooner`]: (user, message, bot, state) =>
        bot.chat(state.handlePercentCmd(user, prefix, message, bot, state)),

    [`${prefix}clown`]: (user, message, bot, state) =>
        bot.chat(state.handlePercentCmd(user, prefix, message, bot, state)),

    [`${prefix}cap`]: (user, message, bot, state) => {
        const args = getArgs(message, prefix, "cap");
        let target = args[0];
        const result = state.random_element(state.cap_replies);
        if (target === 'random') {
            const players = Object.keys(bot.players);
            target = state.random_element(players);
        } else if (target === '|') {
            target = user;
        }
        if (target && target.trim().length > 0) {
            bot.chat(state.safeChat(`${target}: ${result}`));
        } else {
            bot.chat(state.safeChat(`${user}: ${result}`));
        }
    },

    [`${prefix}gender`]: (user, message, bot, state) => {
        const args = getArgs(message, prefix, "gender");
        let target = args[0];
        const result = state.random_element(state.gender_results);
        if (target === 'random') {
            const players = Object.keys(bot.players);
            target = state.random_element(players);
        } else if (target === '|') {
            target = user;
        }
        if (target && target.trim().length > 0) {
            bot.chat(state.safeChat(`${target}: ${result}`));
        } else {
            bot.chat(state.safeChat(`${user}: ${result}`));
        }
    },
    [`${prefix}npc`]: (user, message, bot, state) => {
        const args = getArgs(message, prefix, "npc");
        let target = args[0];
        const result = state.random_element(state.npc_replies);
        if (target === 'random') {
            const players = Object.keys(bot.players);
            target = state.random_element(players);
        } else if (target === '|') {
            target = user;
        }
        if (target && target.trim().length > 0) {
            bot.chat(state.safeChat(`${target}: ${result}`));
        } else {
            bot.chat(state.safeChat(`${user}: ${result}`));
        }
    },

    [`${prefix}screen`]: (user, message, bot, state) => {
        const args = getArgs(message, prefix, "screen");
        let target = args[0];
        const screen = state.random_element(state.screen_replies);
        if (target === 'random') {
            const players = Object.keys(bot.players);
            target = state.random_element(players);
        } else if (target === '|') {
            target = user;
        }
        if (target && target.trim().length > 0) {
            bot.chat(state.safeChat(`${target}'s screen right now: ${screen}`));
        } else {
            bot.chat(state.safeChat(`${user}'s screen right now: ${screen}`));
        }
    },

    [`${prefix}boobs`]: (user, message, bot, state) => {
        const args = getArgs(message, prefix, "boobs");
        let target = args[0];
        const randomSize = state.sizes[Math.floor(Math.random() * state.sizes.length)];
        if (target === 'random') {
            const players = Object.keys(bot.players);
            target = state.random_element(players);
        } else if (target === '|') {
            target = user;
        }
        if (target && target.trim().length > 0) {
            bot.chat(state.safeChat(`${target} has: ${randomSize}-cups`));
        } else {
            bot.chat(state.safeChat(`${user} has: ${randomSize}-cups`));
        }
    },

    [`${prefix}fetish`]: (user, message, bot, state) => {
        const args = getArgs(message, prefix, "fetish");
        let target = args[0];
        const randomFetish = state.fetish_results[Math.floor(Math.random() * state.fetish_results.length)];
        if (target === 'random') {
            const players = Object.keys(bot.players);
            target = state.random_element(players);
        } else if (target === '|') {
            target = user;
        }
        if (target && target.trim().length > 0) {
            bot.chat(state.safeChat(`${target}'s fetish is: ${randomFetish}`));
        } else {
            bot.chat(state.safeChat(`${user}'s fetish is: ${randomFetish}`));
        }
    },

    [`${prefix}shower`]: (user, message, bot, state) => {
        const args = getArgs(message, prefix, "shower");
        let target = args[0];
        const days = Math.floor(Math.random() * 365);
        if (target === 'random') {
            const players = Object.keys(bot.players);
            target = state.random_element(players);
        } else if (target === '|') {
            target = user;
        }
        if (target && target.trim().length > 0) {
            bot.chat(state.safeChat(`${target} has showered last time ${days} days ago`));
        } else {
            bot.chat(state.safeChat(`${user} has showered last time ${days} days ago`));
        }
    },

    [`${prefix}8ball`]: (user, message, bot, state) => {
        const response = state.random_element(state.answers);
        bot.chat(state.safeChat(`[8-ball] ${response}`));
    },

    [`${prefix}roll`]: (user, message, bot, state) => {
        const rolled = Math.floor(Math.random() * 5) + 1;
        bot.chat(state.safeChat(`[Dice] Rolled a ${rolled}`));
    },

    [`${prefix}flip`]: (user, message, bot, state) => {
        const result = Math.random() < 0.5 ? "Heads" : "Tails";
        bot.chat(state.safeChat(`[CoinFlip] It's ${result}`));
    },

    [`${prefix}choose`]: (user, message, bot, state) => {
    const args = getArgs(message, prefix, "choose");
    if (!args.length) return bot.chat(state.safeChat(`Usage: ${prefix}choose option1, option2, ...`));
    const options = args.join(" ").split(",").map(x => x.trim()).filter(Boolean);
    if (options.length < 2) return bot.chat(state.safeChat("Give me at least 2 choices."));
    const choice = state.random_element(options);
    bot.chat(state.safeChat(`I choose: ${choice}`));
    },

    [`${prefix}playerlist`]: (user, message, bot, state) => {
        const players = Object.keys(bot.players).length;
        if (players.length === 0) {
            bot.chat(state.safeChat("No players online."));
        } else {
            const tabPlayers = bot.tablist?.header?.text.split('§cOnline players: §f')[1].replace('\n', '')
            bot.chat(state.safeChat(`Players in-game: ${players}, Players in-total: ${tabPlayers}`));
        }
    },

    [`${prefix}tps`]: (user, message, bot, state) => {
        const serverTPS = state.getCurrentTPS().toFixed(2); // from update_time packets
        const clientTPS = bot.getTps().toFixed(2); // from mineflayer-tps plugin

        bot.chat(state.safeChat(`Client TPS: ${clientTPS} | Server TPS: ${serverTPS}`));
    },

    [`${prefix}kd`]: (user, message, bot, state) => {
        const args = getArgs(message, prefix, "kd");
        let target = args[0];
        if (target === 'random') {
            const players = Object.keys(bot.players);
            target = state.random_element(players);
        } else if (target === '|') {
            target = user;
        }
        if (target && target.trim().length > 0) {
            bot.chat(state.safeChat(state.get_kd(target, state)));
        } else {
            bot.chat(state.safeChat(state.get_kd(user, state)));
        }
    },

    [`${prefix}quote`]: (user, message, bot, state) => {
        const args = getArgs(message, prefix, "quote");
        let target = args[0];
        if (target === 'random') {
            const players = Object.keys(bot.players);
            target = state.random_element(players);
        } else if (target === '|') {
            target = user;
        }
        if (target && target.trim().length > 0) {
            if (state.quotes[target] && state.quotes[target].length > 0) {
                const randomQuote = state.quotes[target][Math.floor(Math.random() * state.quotes[target].length)];
                bot.chat(state.safeChat(`Quote from ${target}: "${randomQuote}"`));
            } else {
                bot.chat(state.safeChat(`No quotes found for ${target}.`));
            }
        } else {
            bot.chat(state.safeChat(`Usage: ${prefix}quote <username>`));
        }
    },

    [`${prefix}restart`]: (user, message, bot, state) => {
        let counting = false
        if (state.server_restart !== 0) {
            bot.chat(state.safeChat(`Server will restart in approximately: ${state.server_restart} seconds.`))
            counting = true
        } else if (counting && state.server_restart === 0) {
            // bot.chat(state.safeChat("Countdown is 0, but server didn't restart, did it?"))
        } else {
            bot.chat(state.safeChat("Server didn't announce when server restarts."))
        }
    },

    [`${prefix}paranoia`]: (user, message, bot, state) => {
        const args = getArgs(message, prefix, "paranoia");
        let target = args[0];
        const percent = Math.floor(Math.random() * 101);
        if (target === 'random') target = state.random_element(Object.keys(bot.players));
        else if (target === '|') target = user;
        if (target && target.trim()) {
            bot.chat(state.safeChat(`${target} is ${percent}% paranoid`));
        } else {
            bot.chat(state.safeChat(`${user} is ${percent}% paranoid`));
        }
    },

    [`${prefix}stats`]: (user, message, bot, state) => {
        bot.chat(state.safeChat(`Bot uses: ${state.bot_uses}, Bot tips sent: ${state.bot_tips_sent}, Ads seen: ${state.ads_seen}, word "dupe" mentioned: ${state.dupe_mentioned}, public command: ${Object.keys(public_commands).length}`))
    },

    [`${prefix}jd`]: async (user, message, bot, state) => {
        const args = getArgs(message, prefix, "jd");
        let target = args[0] || user;
        if (target === 'random') {
            const players = Object.keys(bot.players);
            target = state.random_element(players);
        } else if (target === '|') {
            target = user;
        }
        if (!state.joindates[target]) {
            state.joindates[target] = await state.fetchJD(target.trim());
        }
        if (state.joindates[target] !== null) {
            bot.chat(state.safeChat(`${target} joined on: ${state.joindates[target]}`));
        } else {
            bot.chat(state.safeChat(`User ${target} doesn't exist or never joined.`));
            delete state.joindates[target];
        }
    },

    [`${prefix}weather`]: (user, message, bot, state) => {
        let rainState = bot.rainState > 0 ? 'Raining' : 'Clear skies';
        let thunderState = bot.thunderState > 0 ? 'Thunderstorm' : 'No thunder';

        bot.chat(state.safeChat(`Weather: ${rainState} | ${thunderState}`));
    },

    [`${prefix}time`]: (user, message, bot, state) => {
        const timeOfDay = bot.time.timeOfDay;
        const day = bot.time.day;

        const timeState = timeOfDay === 0 ? 'Sunrise' :
                        timeOfDay < 6000 ? 'Morning' :
                        timeOfDay === 6000 ? 'Noon' :
                        timeOfDay < 12000 ? 'Afternoon' :
                        timeOfDay === 12000 ? 'Sunset' :
                        timeOfDay < 18000 ? 'Evening' :
                        timeOfDay === 18000 ? 'Midnight' :
                        'Night';

        const moonPhases = [
        'Full Moon', 'Waning Gibbous', 'Third Quarter',
        'Waning Crescent', 'New Moon', 'Waxing Crescent',
        'First Quarter', 'Waxing Gibbous'
        ];
        const moonPhaseIndex = bot.time.moonPhase;
        const moonPhase = moonPhases[moonPhaseIndex] || 'Unknown';

        bot.chat(state.safeChat(`Day ${day} | Time: ${timeState} (${Math.floor(timeOfDay)}/24000 ticks) | Moon Phase: ${moonPhase}`));
    },

    // not in use. maybe later

    /*[`${prefix}poll`]: (user, message, bot, state) => {
        let args = message.split(`${prefix}poll `)[1]

        if (args && args.length > 0) {
            let poll_objects = args.includes(', ') ? args.split(', ') : args.split(' ');

            const topic = args[0]
            const option_1 = args[1]
            const option_2 = args[2]
            const time_length = args[3]

            bot.chat(state.safeChat(`[POLL] Poll has started!:`)
        }
    },*/
    [`${prefix}count`]: (user, message, bot, state) => {
        const args = getArgs(message, prefix, "count");
        const num = parseInt(args[0]);
        if (isNaN(num)) {
            bot.chat(state.safeChat("Please provide a valid number."));
        } else if (num !== state.current_count) {
            bot.chat(state.safeChat(`Wrong number! Expected: ${state.current_count}. Resetting to 0.`));
            state.current_count = 0;
        } else {
            state.current_count++;
            bot.chat(state.safeChat(`Correct! Continue counting by running: -count ${state.current_count}`));
        }
    },

    [`${prefix}ping`]: (user, message, bot, state) => {
        const args = getArgs(message, prefix, "ping");
        let target = args[0];
        if (target === 'random') {
            const players = Object.keys(bot.players);
            target = state.random_element(players);
        } else if (target === '|') {
            target = user;
        }
        if (target && target.trim().length > 0) {
            bot.chat(state.safeChat(`${target}'s ping is: ${bot.players[target]?.ping}ms`));
        } else {
            bot.chat(state.safeChat(`${user}'s ping is: ${bot.players[user]?.ping}ms`));
        }
    },

    [`${prefix}playerjoins`]: (user, message, bot, state) => {
        let newest_user = state.newest_player ? "Yes" : "No"

        bot.chat(state.safeChat(`Players joined logged: ${state.joined}, Most recent join: ${state.recent_join || 'None'} (Is he new?: ${newest_user})`))
    },

    [`${prefix}playerquits`]: (user, message, bot, state) => {
        bot.chat(state.safeChat(`Players left logged: ${state.quitted}, Most recent quit: ${state.recent_quit || 'None'}`))
    },

    [`${prefix}avgping`]: (user, message, bot, state) => {
        let total = 0;
        let count = 0;

        for (let name in bot.players) {
            let ping = bot.players[name]?.ping;
            if (typeof ping === 'number') {
                total += ping;
                count++
            }
        }

        let avg = (total / count).toFixed(1);
        bot.chat(state.safeChat(`Avg Server Ping: ${avg}ms`));
    },

    [`${prefix}marry`]: (user, message, bot, state) => {
    const args = getArgs(message, prefix, "marry");
    let target = args[0];
    if (!target) return bot.chat(state.safeChat(`Usage: ${prefix}marry <player>`));
    if (user === target) return bot.chat(state.safeChat(`${user}, you can't marry yourself.`));
    if (state.marriages[user]) return bot.chat(state.safeChat(`${user}, you're already married to ${state.marriages[user]}.`));
    if (state.marriages[target]) return bot.chat(state.safeChat(`${target} is already married to ${state.marriages[target]}.`));
    state.pendingMarriage[target] = user;
    bot.chat(`/msg ${target} ${user} wants to marry you! Type "${prefix}accept" to accept.`);
    },

    // --- ACCEPT MARRIAGE ---
    [`${prefix}accept`]: (user, message, bot, state) => {
        if (!state.pendingMarriage[user]) return bot.chat(state.safeChat(`${user}, nobody has proposed to you.`));

        const proposer = state.pendingMarriage[user];
        state.marriages[user] = proposer;
        state.marriages[proposer] = user;
        delete state.pendingMarriage[user];

        bot.chat(state.safeChat(`${user} and ${proposer} are now married!`));
    },

    // --- DIVORCE REQUEST ---
    [`${prefix}divorce`]: (user, message, bot, state) => {
        const args = getArgs(message, prefix, "divorce");
        let target = args[0];
        if (!target) return bot.chat(state.safeChat(`Usage: ${prefix}divorce <player>`));
        if (!state.marriages[user] || state.marriages[user] !== target) {
            return bot.chat(state.safeChat(`${user}, you are not married to ${target}.`));
        }
        state.pendingDivorce[target] = user;
        bot.chat(`/msg ${target} ${user} wants to divorce you. Type "${prefix}acceptdivorce" to confirm.`);
    },

    // --- ACCEPT DIVORCE ---
    [`${prefix}acceptdivorce`]: (user, message, bot, state) => {
        if (!state.pendingDivorce[user]) {
            return bot.chat(state.safeChat(`${user}, nobody has asked to divorce you.`));
        }

        const requester = state.pendingDivorce[user];
        delete state.pendingDivorce[user];

        delete state.marriages[requester];
        delete state.marriages[user];

        bot.chat(`/msg ${requester} ${user} accepted the divorce. You are no longer married.`);
        bot.chat(`/msg ${user} You have divorced ${requester}.`);

        bot.chat(state.safeChat(`${user} and ${requester} are now divorced.`));
    },
    
    [`${prefix}coords`]: (user, message, bot, state) => {
        const x_minus = Math.random() > 0.5 ? "-" : ""
        const z_minus = Math.random() > 0.5 ? "-" : ""

        const x_coord = Math.floor(Math.random() * 30_000_000)
        const y_coord = Math.floor((Math.random() * 10)+60)          
        const z_coord = Math.floor(Math.random() * 30_000_000)        

        bot.chat(state.safeChat(`Go to ${x_minus}${x_coord} X, ${y_coord} Y, ${z_minus}${z_coord} Z for an suprise.`))
    },

    [`${prefix}longestcd`]: (user, message, bot, state) => {
        if (state.longest_cooldown) {
            bot.chat(state.safeChat(`Longest cooldown so far: ${state.longest_cooldown} seconds.`));
        } else {
            bot.chat(state.safeChat("No cooldowns recorded yet."));
        }
    },

    [`${prefix}discord`]: (user, message, bot, state) => {
        bot.chat(state.safeChat(`Official discord server of .22 - https://discord.gg/mjrDsGCV7F`))
    }    
}

const admin_commands = {
    // Uncomment and fill if needed
    // ":tp": (user) => bot.chat(`/tpa ${user}`),
    // ":scan": (user, message, bot, state) => {
    //   auto_tp = !auto_tp;
    //   bot.chat(state.safeChat(`Scanner is now ${auto_tp ? "ON" : "OFF"}!`);
    // },
    // ":pos": (user, message, bot, state) => {
    //   const pos = bot.entity.position;
    //   bot.chat(state.safeChat(`My position is: ${Math.floor(pos.x)} X, ${Math.floor(pos.y)} Y, ${Math.floor(pos.z)} Z!`);
    // },
    // ":hotspot": (user, message, bot, state) => {
    //   scan_hotspot = !scan_hotspot;
    //   bot.chat(state.safeChat(`Hotspot logger is now ${scan_hotspot ? "ON" : "OFF"}!`);
    // },

    [`${prefix}ignore`]: (user, message, bot, state) => {
        const args = getArgs(message, prefix, "ignore");
        let target = args[0];
        if (target && target.trim().length > 0) {
            bot.chat(state.safeChat(`/ignore ${target}`));
        } else {
            bot.chat(state.safeChat(`Usage: ${prefix}ignore <username>`));
        }
    },

    [`${prefix}forcesave`]: (user, message, bot, state) => {
            if (superusers.map(u => u.toLowerCase()).includes(user.toLowerCase())) {
            state.saveBotData(state)
        }
    },

    [`${prefix}checkuses`]: (user, message, bot, state) => {
        console.log(state.safeChat(state.bot_uses))
    },    

    [`${prefix}debug`]: (user, message, bot, state) => {
        const args = getArgs(message, prefix, "debug");
        const section = args[0];
        if (section && section.trim().length > 0) {
            if (section === 'basic') {
                const loadedChunks = Object.keys(bot.world?.chunks || {}).length || 'None';
                const openWindow = bot.currentWindow?.title || 'None';
                const heldItem = bot.heldItem?.name || 'None';
                bot.chat(`/msg ${user} Chunks: ${loadedChunks} | Window: ${openWindow} | Held: ${heldItem}`);
                console.log(bot.entities || 'None');
                console.log(bot.tablist || 'None');
                console.log(bot.players || 'None');
            } else if (section === 'inventory') {
                console.log(bot.inventory?.items() || 'None');
            } else if (section === 'entityData') {
                const entities = Object.values(bot.entities || {});
                if (entities.length === 0) console.log('None');
                else entities.forEach(e => {
                    console.log(`Type: ${e.type || 'None'}, UUID: ${e.uuid || 'None'}, Vel: ${e.velocity || 'None'}`);
                });
            } else if (section === 'window') {
                console.log(bot.currentWindow?.title || 'None');
                console.log(bot.currentWindow?.slots || 'None');
            } else if (section === 'pathfinder') {
                console.log(bot.pathfinder?.goal || 'None');
                console.log(bot.pathfinder?.path || 'None');
            } else if (section === 'chatListeners') {
                const listeners = bot._client?.listeners('chat') || [];
                console.log(listeners.length > 0 ? listeners : 'None');
            } else if (section === 'settings') {
                const info = {
                    username: bot.username || 'None',
                    version: bot.version || 'None',
                    health: bot.health || 'None',
                    food: bot.food || 'None',
                    xp: bot.experience || 'None',
                    creative: bot.game?.gameMode === 1 ? 'Yes' : 'No',
                    isAlive: bot.health > 0 ? 'Yes' : 'No'
                };
                const settingsMsg = Object.entries(info).map(([k, v]) => `${k}: ${v}`).join(' | ');
                bot.chat(`/msg ${user} ${settingsMsg}`);
            } else if (section === 'network') {
                const ping = bot.player?.ping || 'None';
                const latency = bot._client?.latency || 'None';
                const brand = bot.serverBrand || 'None';
                const stateClient = bot._client?.state || 'None';
                bot.chat(`/msg ${user} Ping: ${ping} | Brand: ${brand} | Latency: ${latency} | State: ${stateClient}`);
            } else if (section === 'skin') {
                console.log('Skin Parts:', bot.player?.skinParts || 'None');
            } else if (section === 'players') {
                const list = Object.keys(bot.players || {});
                bot.chat(`/msg ${user} Online Players (${list.length}): ${list.length > 0 ? list.join(', ') : 'None'}`);
            } else if (section === 'plugins') {
                console.log('Scoreboard Teams:', bot.scoreboard?.teams || 'None');
                console.log('Plugin Channels:', bot._client?.pluginChannels || 'None');
            } else if (section === 'state') {
                bot.chat(`/msg ${user} Bot State: spawned ${state.spawnedIn || 'None'} times`);
                console.log(state || 'None');
            } else if (section === 'raw') {
                console.log(bot || 'None');
            } else if (section === 'tablist') {
                console.log(bot.tablist || 'None');
            } else if (section === 'sections' || section === 'list') {
                const debugSections = [
                    'basic', 'inventory', 'entityData', 'window', 'pathfinder',
                    'chatListeners', 'settings', 'network', 'skin', 'players',
                    'plugins', 'state', 'raw', 'tablist', 'sections'
                ];                
                bot.chat(`/msg ${user} Available debug sections: ${debugSections.join(', ')}`);
            } else {
                bot.chat(`/msg ${user} Unknown debug section: "${section}". Run ${prefix}debug sections.`);
            }

            console.log(`[DEBUG] ${user} ran debug "${section}"`);
        } else {
            const loadedChunks = Object.keys(bot.world?.chunks || {}).length || 'None';
            const openWindow = bot.currentWindow?.title || 'None';
            const creative = bot.game?.gameMode === 1 ? 'Yes' : 'No';
            const flying = bot.entity?.onGround === false ? 'Yes' : 'No';
            const held = bot.heldItem?.name || 'None';
            const ping = bot.player?.ping || 'None';
            const mem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) || 'None';

            const info = `Ping: ${ping} | Chunks: ${loadedChunks} | Window: ${openWindow} | Creative: ${creative} | Flying: ${flying} | Held: ${held} | Memory: ${mem}MB`;
            bot.chat(`/msg ${user} ${info} — run "${prefix}debug (section)" for more.`);
        }
    },


    [`${prefix}run`]: (user, message, bot, state) => {
        const message_to_run = message.split(`${prefix}run `)[1];
        if (message_to_run && message_to_run.trim() !== '') {
            const blacklist = ["/ignore", "/delhome", "/freecam", "/balloons", "/tpy", "/kill", "/suicide",
                "/togglewhispering", "/togglechat", "/hotspot", "/hotspot create"
            ];
            if (!blacklist.some(cmd => message_to_run.includes(cmd))) {
                bot.chat(message_to_run);
            } else {
                bot.chat(state.safeChat("Blacklisted command!"));
            }
        } else {
            bot.chat(`/w ${user} Usage -run <command?>`)
        }
    },

    [`${prefix}say`]: (user, message, bot, state) => {
        const message_to_run = message.split(`${prefix}say `)[1];
        if (message_to_run && message_to_run.trim() !== '') {
            bot.chat(state.safeChat(` ${message_to_run}`)) // space at start doesn't let any commands to run
        } else {
            bot.chat(`/w ${user} Usage -say <message>`)
        }
    },

    [`${prefix}welcomer`]: (user, message, bot, state) => {
       state.welcomer = !state.welcomer;
       bot.chat(state.safeChat(`Scanner is now ${state.welcomer ? "ON" : "OFF"}!`));
    },

    [`${prefix}tempwl`]: (user, message, bot, state) => {
        let args = message.split(`${prefix}tempwl `)[1];
        state.whitelist.push(String(args))
        console.log(`Whitelisted ${args}.`)
        bot.chat(`/msg ${user} Whitelisted ${args}.`)
    },

    [`${prefix}remwl`]: (user, message, bot, state) => {
        let args = message.split(`${prefix}remwl `)[1];
        if (superusers.map(u => u.toLowerCase()).includes(user.toLowerCase())) {
            if (!state.whitelist.includes(args)) {
                bot.whisper(user, `${args} is not in the whitelist.`);
                return;
            }

            state.whitelist = state.whitelist.filter(p => p !== args);
            console.log(`Removed ${args} from whitelist.`)
            bot.chat(`/msg ${user} Removed ${args} from whitelist.`)
        }
    },
    [`${prefix}timeout`]: (user, message, bot, state) => {
        if (superusers.map(u => u.toLowerCase()).includes(user.toLowerCase())) {
            bot.chat(state.safeChat("Removing keep_alive listener!, timing out in 30 seconds as of now."))
            bot._client.removeAllListeners('keep_alive');    
        }
    }, 
}

module.exports = { public_commands, admin_commands };