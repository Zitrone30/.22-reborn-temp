// events.js
module.exports = function(bot, state) {
    let {
        spam_messages,
        blacklisted_messages,
        return_user,
        checkSpam,
        whitelisted_users,
        admin_commands,
        public_commands,
        responses,
        PASSWORD,
        welcomer,
    } = state;

    bot.on('spawn', () => {
        state.spawnedIn += 1;

        if (!state.tips_started && state.spawnedIn == 2) {
            let tipIndex = 0;
            state.tips_started = true
            setInterval(() => {
                if (spam_messages.length === 0) return;

                bot.chat(spam_messages[tipIndex]);
                tipIndex = (tipIndex + 1) % spam_messages.length;
                state.bot_tips_sent++;
            }, 180000); // every 3 minutes
        }
    });

    bot.on("playerCollect", async (collector, collected) => {
        if (collector.username === bot.username) {
            const inventory = bot.inventory.items();
            for (const item of inventory) {
                await bot.tossStack(item);
            }
        }
    });

    bot.on('login', () => {
        console.log('Logged In');
        bot.setControlState("forward", true);
        bot.setControlState("jump", true);
    });

    bot.on('bossBarCreated', async (bossBar) => {
        const bossBar_text = bossBar?.title?.text;

        if (state.auto_tp) state.auto_tp = false;

        if (typeof bossBar_text === "string" && bossBar_text.includes("teleport with /hotspot") && state.scan_hotspot) {
            bot.chat("/hotspot");
            setTimeout(() => {
                const pos = bot.entity.position;
                const info = `${Math.floor(pos.x)}.X, ${Math.floor(pos.y)}.Y, ${Math.floor(pos.z)}.Z in minecraft:${bot.game.dimension}`;
                state.safeChat(`Hotspot Located At: ${info}`, bot);
                state.hotspot_death = true;
                bot.chat("/kill");
                state.hotspot_death = false;
            }, 10750);
        }
    });

    bot.on("death", () => {
        console.log("Died!");
        bot.clearControlStates(); // Planned to make it more human, but meh
        bot.setControlState("forward", true);
        bot.setControlState("jump", true);

        if (!state.hotspot_death) {
            state.deaths++;
        }
    });

    bot.on('messagestr', (message) => {
        const username = return_user(message);
        let command = message.split('» ')[1] || message.split("whispers: ")[1] || '';

        if (state.spawnedIn < 2) {
            if (!state.loggedIn) {
                if (message.includes("/login")) {
                    bot.chat(`/login ${PASSWORD}`);
                    state.loggedIn = true;
                } else if (message.includes("/register")) {
                    bot.chat(`/register ${PASSWORD}`);
                    state.loggedIn = true;
                }
            }
            return;
        }

        if (state.spawnedIn >= 2 && !blacklisted_messages.some(blk => message.includes(blk)) && message.trim() !== '') {
            console.log(message);      
        }

        if (message.includes('»')) {
            const blacklist = ["moooomoooo", "7thSealBot", ".22", "kazwqi", "KaizBot", "KitBot1"];
            if (blacklist.includes(username.toLowerCase())) return; // case-insensitive check
        
            const msgLower = message.toLowerCase();
            
            const isAd =
                msgLower.includes("join ") ||
                msgLower.includes("subscribe") ||
                msgLower.includes("free kits") ||
                msgLower.includes("discord.gg") ||
                msgLower.includes("dsc.gg") ||
                msgLower.includes(".com") ||
                msgLower.includes(".net") ||
                msgLower.includes(".org") ||
                msgLower.includes(".uk") ||
                /\b\d{1,3}(\.\d{1,3}){3}\b/.test(msgLower);
        
            const isCommand = msgLower.startsWith('-') || msgLower.startsWith('/');
        
            let cleanedMessage = message.replace(/^\[[^\]]+\]\s*/, '');
            cleanedMessage = cleanedMessage.replace(/<\/?Malachite>/g, '');
        
            const msgText = cleanedMessage.split('» ')[1] || '';
            if (!isAd && !isCommand && /^[\x00-\x7F\s.,'?!\-":;()0-9]+$/.test(msgText)) {
                if (!state.quotes[username]) state.quotes[username] = [];
        
                const newMsg = cleanedMessage.trim();
                const lastFew = state.quotes[username].slice(-5);
                const alreadyExistsRecently = lastFew.some(q => {
                    const existingMsg = q.substring(q.indexOf('>') + 2).trim();
                    return existingMsg.toLowerCase() === newMsg.toLowerCase();
                });
                if (alreadyExistsRecently) return;
        
                const now = new Date();
                const date = now.toISOString().slice(0, 10);
                const time = now.toTimeString().slice(0, 5);
                const timestamp = `${date} ${time}`;
        
                state.quotes[username].push(`<${timestamp}> ${newMsg}`);
            }
        }


        if (state.auto_tp) {
            const teleport = ['tp', 'come', 'teleport', 'give me'];
            if (teleport.some(word => command.toLowerCase().includes(word)) && !command.includes("http")) {
                console.log("Teleporting to", username);
                bot.chat(`/tpa ${username}`);
            }
        }

        if (state.loggedIn && state.spawnedIn >= 2) {
            if (command.startsWith("<Malachite>")) {
                command = command.replace("<Malachite>", "").replace("</Malachite>", "");
            }

            if (command.startsWith(state.prefix)) {
                const cmd = command.split(" ")[0].toLowerCase();

                if (message.includes(".org") || message.includes(".uk") || message.includes(".com") || message.includes(".gg") || message.includes(".me")) return;

                if (whitelisted_users(username)) {
                    for (const key in admin_commands) {
                        if (cmd.trim() === key.toLowerCase()) {
                            admin_commands[key](username, command, bot, state);
                            break;
                        }
                    }
                }

                for (const key in public_commands) {
                    if (cmd.trim() === key.toLowerCase()) {
                        public_commands[key](username, command, bot, state);
                        break;
                    }
                }

                state.bot_uses++;
            }
        }


        if (message.includes('dsc.gg') || message.includes('discord.gg')) {
            state.ads_seen++;
        }

        if (message.includes('dupe') && !(message.includes('dsc.gg') || message.includes('discord.gg')) ) {
            state.dupe_mentioned++;
        }        
        
        if (message.includes("Server restarts in") && !message.includes('»')) {
            // Server restarts in 25200s
            if (state.server_restart === 0) {
                state.server_restart = Number(message.split('Server restarts in ')[1].replace('s', '').trim())
                
                setInterval(() => {
                    state.server_restart--;
                }, 1000)
            }
        }

        // cooldown

        if ((message.includes('Please wait') && message.includes('seconds before sending another message!')) && !message.includes('»')) {
            let seconds_of_cooldown = parseInt(message.split('Please wait ')[1].split('seconds before sending another message!')[0].replace('s', ''))
            state.cooldown = seconds_of_cooldown

            if (!state.longest_cooldown || seconds_of_cooldown > state.longest_cooldown) {
                state.longest_cooldown = seconds_of_cooldown;
            }            
        }

        if (message.includes("died") && !message.includes('»')) {
            state.global_deaths++;

            if (message.includes('vined_on_top')) {
                state.vined_on_top_deaths++;
            }

            if (message.includes('i_am_vined')) {
                state.i_am_vined_deaths++;
            }

            if (message.includes('Damix2131')) {
                state.damix_deaths++;
            }
        }

        if (message.includes("using an end crystal") && !message.includes('»')) {
            const get_killer = message.split("by ")[1].split(" using")[0].trim();
            const get_victim = message.split(" was")[0].trim();

            state.crystalled++;
            state.global_deaths++;

            if (get_killer !== get_victim) {
                state.crystal_kills[get_killer] = (state.crystal_kills[get_killer] || 0) + 1;
                state.crystal_deaths[get_victim] = (state.crystal_deaths[get_victim] || 0) + 1;
            }
        }

        if (message.includes("/tpy")) {
            if (message.includes("Damix2131")) {
                bot.chat(`/tpy Damix2131`);
            } else {
                const decline_username = message.split(' wants to teleport to you.')[0]
                bot.chat(`/tpn ${decline_username}`);
            }
        }

        if (message.includes("/tpy")) {
            if (message.includes("ryk_cbaool")) {
                bot.chat(`/tpy ryk_cbaool`);
            } else {
                const decline_username = message.split(' wants to teleport to you.')[0]
                bot.chat(`/tpn ${decline_username}`);
            }
        }

        for (const response in responses) {
            if (message.includes(response) || command.includes(response)) {
                responses[response](message);
            }
        }

        if (message.includes("joined") && !message.includes('»')) {
            let joined_user = message.split(" joined")[0]

            if (welcomer && !message.includes(bot.username)) {
                const player = message.split("joined")[0].trim();
                console.log(`Player ${player} currently joined.`);
                bot.chat(`/whisper ${player} Welcome to 6b6t.org ${player}!`);
            }
            if (message.includes('the game for the first time')) {
                state.newest_player = true
            } else {
                state.newest_player = false
            }

            state.recent_join = joined_user
            state.joined++;

            /*if (!state.session[joined_user]) {
                state.session[joined_user] = {
                sessions: [{
                    joined: Date.now(),
                    quit: 0,
                    total: 0
                }]
            }}

            else if (state.session[joined_user] && state.session[joined_user].quit !== 0) {
                state.session[joined_user].sessions.joined = Date.now();
                state.session[joined_user].sessions.quit = 0;
            }*/
        }

        if (message.includes("quit") && !message.includes('»')) {
            let quitted_user = message.split(" quit")[0]     
            state.recent_quit = quitted_user       
            state.quitted++;

            /*if (state.session[quitted_user] && state.session[quitted_user].quit === 0) {
                state.session[quitted_user].quit = Date.now()
                state.session[quitted_user].total += state.session[quitted_user].quit - state.session[quitted_user].joined
            } */
        }
    });
  
    bot.on('packet', (data, meta) => {
        if (meta.name === 'update_time') {
            if (state.currentWorldAge === 0) {
                state.currentWorldAge = data.age
                state.timeLast = Date.now()
            } else {
                let now = Date.now()
                getServerTPS(state.currentWorldAge, data.age, (now-timeLast), state.restarted)
                state.currentWorldAge = data.age
                state.timeLast = now            
            }
            // "please chatgpt give me an schematic and not a full code, i want to learn actually"
            // said by Damix2131, everytime trying to code something and chatgpt gives full code
            // WOAH?!! CHATGPT USER USING CHATGPT TO ACTUALLY STUDY!??
            // night ignore that comment, im so tired mentally once again (calculating tps is stupid)
            // the comments will be longer than the setup overall
        }
    })

    bot.on('kicked', (reason) => {
        console.log('[Kicked]', reason);
    });

    bot.on('end', (reason) => {
        console.log('[Disconnected]', reason);
        bot.quit()
        if (state.restart) {
            state.loggedIn = false;
            state.restarted = true;
            state.spawnedIn = 0;
            setTimeout(() => global.startup(), 10000);
        }
    });

    bot.on('error', (err) => {
        console.error('[Bot Error]', err);
        bot.quit()
        if (err.code === 'ECONNREFUSED' || err.message.includes('timed out')) {
            console.log('Attempting to reconnect...');
            state.restarted = true;
            setTimeout(() => global.startup(), 10000);
        }
    });
};
